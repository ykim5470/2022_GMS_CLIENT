'use strict'

require('dotenv').config

const { Server } = require('socket.io')
const http = require('http')
const https = require('https')
const compression = require('compression')
const express = require('express')
const cors = require('cors')
const path = require('path')
const { sequelize } = require('../../models')
const apiHandler = require('./apis/index')
const app = express()

const Logger = require('./helpers/Logger')
const log = new Logger('server')

const port = process.env.PORT || 4000 // must be the same to client.js signalingServerPort
const isHttps = true

let io, server, host

if (isHttps) {
  const fs = require('fs')
  const options = {
    key: fs.readFileSync(
      path.join(__dirname, '../ssl/enjoystreet.com_20210630C19D.key.pem'),
      'utf-8',
    ),
    cert: fs.readFileSync(
      path.join(__dirname, '../ssl/enjoystreet.com_20210630C19D.crt.pem'),
      'utf-8',
    ),
    ca: fs.readFileSync(
      path.join(__dirname, '../ssl/enjoystreet.com_20210630C19D.ca-bundle.pem'),
      'utf-8',
    ),
  }

  server = https.createServer(options, app)
  host = 'https://' + 'localhost' + ':' + port
} else {
  server = http.createServer(app)
  host = 'https://' + 'localhost' + ':' + port
}

/*  
    Set maxHttpBufferSize from 1e6 (1MB) to 1e7 (10MB)
    Set pingTimeout from 20000 ms to 60000 ms 
*/
io = new Server({
  maxHttpBufferSize: 1e7,
  pingTimeout: 60000,
  cors: {
    origin: 'https://106.255.237.50:5000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
  ws: true
}).listen(server)

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log(err)
  })

// Swagger config
const { swaggerUi, swaggerJsDoc } = require('../api/swagger')

// Api config
const apiBasePath = '/api/v1' // api endpoint path
const api_docs = host + apiBasePath + '/docs' // api docs
const api_key_secret = process.env.API_KEY_SECRET || 'mirotalk_default_secret'

// Turn config
const turnEnabled = process.env.TURN_ENABLED
const turnUrls = process.env.TURN_URLS
const turnUsername = process.env.TURN_USERNAME
const turnCredential = process.env.TURN_PASSWORD

let channels = {} // collect channels
let sockets = {} // collect sockets
let peers = {} // collect peers info grp by channels

app.use(cors()) // Enable All CORS Requests for all origins
app.use(compression()) // Compress all HTTP responses using GZip
app.use(express.json()) // Api parse body data as json

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc)) // Swagger

app.use('/uploads', express.static(path.join(__dirname + '/uploads/GUIDE/streaming/live/thumbnailSource/')))
app.set('io', io); // io instance set for router 

app.use('/', apiHandler)

const iceServers = [
  {
    urls: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
      'stun:stun4.l.google.com:19302',
    ],
  },
]

if (turnEnabled == 'true') {
  iceServers.push({
    urls: turnUrls,
    username: turnUsername,
    credential: turnCredential,
  })
}

/**
 * Start Local Server with ngrok https tunnel (optional)
 */
server.listen(port, null, () => {
  log.debug(
    `%c

	███████╗██╗ ██████╗ ███╗   ██╗      ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ 
	██╔════╝██║██╔════╝ ████╗  ██║      ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
	███████╗██║██║  ███╗██╔██╗ ██║█████╗███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
	╚════██║██║██║   ██║██║╚██╗██║╚════╝╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
	███████║██║╚██████╔╝██║ ╚████║      ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
	╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝      ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝ started...

	`,
    'font-family:monospace',
  )

  // server settings
  log.debug('settings', {
    server: host,
    api_docs: api_docs,
    api_key_secret: api_key_secret,
    iceServers: iceServers,
  })
})

/**
 * Users will connect to the signaling server, after which they'll issue a "join"
 * to join a particular channel. The signaling server keeps track of all sockets
 * who are in a channel, and on join will send out 'addPeer' events to each pair
 * of users in a channel. When clients receive the 'addPeer' even they'll begin
 * setting up an RTCPeerConnection with one another. During this process they'll
 * need to relay ICECandidate information to one another, as well as SessionDescription
 * information. After all of that happens, they'll finally be able to complete
 * the peer connection and will be in streaming audio/video between eachother.
 * On peer connected
 */
io.sockets.on('connect', (socket) => {
  log.debug('[' + socket.id + '] connection accepted')

  socket.channels = {}
  sockets[socket.id] = socket

  /**
   * On peer diconnected
   */
  socket.on('disconnect', (reason) => {
    for (let channel in socket.channels) {
      removePeerFrom(channel)
    }
    log.debug('[' + socket.id + '] disconnected', { reason: reason })
    delete sockets[socket.id]
  })

  /**
   * On peer join
   */
  socket.on('join', (config) => {
    log.debug('[' + socket.id + '] join ', config)

    let channel = config.channel
    let peer_name = config.peer_name
    let peer_role = config.peer_role
    let peer_video = config.peer_video
    let peer_audio = config.peer_audio
    let peer_hand = config.peer_hand
    let peer_rec = config.peer_rec

    if (channel in socket.channels) {
      log.debug('[' + socket.id + '] [Warning] already joined', channel)
      return
    }
    // no channel aka room in channels init
    if (!(channel in channels)) channels[channel] = {}

    // no channel aka room in peers init
    if (!(channel in peers)) peers[channel] = {}

    // room locked by the participants can't join
    if (peers[channel]['Locked'] === true) {
      log.debug('[' + socket.id + '] [Warning] Room Is Locked', channel)
      socket.emit('roomIsLocked')
      return
    }

    // collect peers info grp by channels
    peers[channel][socket.id] = {
      peer_name: peer_name,
      peer_role: peer_role,
      peer_video: peer_video,
      peer_audio: peer_audio,
      peer_hand: peer_hand,
      peer_rec: peer_rec,
    }
    log.debug('connected peers grp by roomId', peers)

    addPeerTo(channel)

    channels[channel][socket.id] = socket
    socket.channels[channel] = channel
  })

  // chatting allocation 
  socket.on('chatting', (config) =>{
	const {channel, peer_id, msg} = config 
	console.log(channel, peer_id, msg) 
	  for(let id in channels[channel]) {
		  if(id !== peer_id){
			  channels[channel][id].emit('receiveChat', {
				  from: peer_id, msg: msg})
		  }
	  }
   	console.log(peers)
   	console.log(channels)
  })


  /**
   * Add peers to channel aka room
   * @param {*} channel
   */
  function addPeerTo(channel) {
    // console.log(channels)
    // console.log(channel) // room name aka. 47819WarmPlum
    // console.log(channels) // A만 들어왔을 경우 {} B가 들어왔을 경우 {A}
    let host_socket_obj = channels[channel]
    let host_socket_id = Object.keys(host_socket_obj)[0]
    let host_socket_instance = host_socket_obj[host_socket_id]

    if (host_socket_instance !== undefined) {
      // host offer
      host_socket_instance.emit('addPeer', {
        peer_id: socket.id,
        peers: peers[channel],
        should_create_offer: true,
        iceServers: iceServers,
      })
      // user offer
      socket.emit('addPeer', {
        peer_id: host_socket_id,
        peers: peers[channel],
        should_create_offer: false,
        iceServers: iceServers,
      })
    }
  }

  /**
   * Remove peers from channel aka room
   * @param {*} channel
   */
  async function removePeerFrom(channel) {
    if (!(channel in socket.channels)) {
      log.debug('[' + socket.id + '] [Warning] not in ', channel)
      return
    }

    delete socket.channels[channel]
    delete channels[channel][socket.id]
    delete peers[channel][socket.id]

    switch (Object.keys(peers[channel]).length) {
      case 0:
        // last peer disconnected from the room without room status set, delete room data
        delete peers[channel]
        break
      case 1:
        // last peer disconnected from the room having room status set, delete room data
        if ('Locked' in peers[channel]) delete peers[channel]
        break
    }
    log.debug('connected peers grp by roomId', peers)

    for (let id in channels[channel]) {
      await channels[channel][id].emit('removePeer', { peer_id: socket.id })
      socket.emit('removePeer', { peer_id: id })
      log.debug('[' + socket.id + '] emit removePeer [' + id + ']')
    }
  }

  /**
   * Relay ICE to peers
   */
  socket.on('relayICE', (config) => {
    console.log('이건 relay 되었을 때 이다. user 측에서 이건 되는 건가?')
    let peer_id = config.peer_id
    let ice_candidate = config.ice_candidate

    // log.debug('[' + socket.id + '] relay ICE-candidate to [' + peer_id + '] ', {
    //     address: config.ice_candidate,
    // });
    console.log('이건 peer_id' + peer_id)
    console.log('이건 socket id' + socket.id)
    sendToPeer(peer_id, sockets, 'iceCandidate', {
      peer_id: socket.id,
      ice_candidate: ice_candidate,
    })
  })

  /**
   * Relay SDP to peers
   */
  socket.on('relaySDP', (config) => {
    let peer_id = config.peer_id
    let session_description = config.session_description

    log.debug(
      '[' + socket.id + '] relay SessionDescription to [' + peer_id + '] ',
      {
        type: session_description.type,
      },
    )

    sendToPeer(peer_id, sockets, 'sessionDescription', {
      peer_id: socket.id,
      session_description: session_description,
    })
  })

  /**
   * Refresh Room Status (Locked/Unlocked)
   */
  socket.on('roomStatus', (config) => {
    let room_id = config.room_id
    let room_locked = config.room_locked
    let peer_name = config.peer_name

    peers[room_id]['Locked'] = room_locked

    log.debug(
      '[' +
        socket.id +
        '] emit roomStatus' +
        ' to [room_id: ' +
        room_id +
        ' locked: ' +
        room_locked +
        ']',
    )

    sendToRoom(room_id, socket.id, 'roomStatus', {
      peer_name: peer_name,
      room_locked: room_locked,
    })
  })

  /**
   * Relay NAME to peers
   */
  socket.on('peerName', (config) => {
    let room_id = config.room_id
    let peer_name_old = config.peer_name_old
    let peer_name_new = config.peer_name_new
    let peer_id_to_update = null

    for (let peer_id in peers[room_id]) {
      if (peers[room_id][peer_id]['peer_name'] == peer_name_old) {
        peers[room_id][peer_id]['peer_name'] = peer_name_new
        peer_id_to_update = peer_id
      }
    }

    if (peer_id_to_update) {
      log.debug(
        '[' + socket.id + '] emit peerName to [room_id: ' + room_id + ']',
        {
          peer_id: peer_id_to_update,
          peer_name: peer_name_new,
        },
      )

      sendToRoom(room_id, socket.id, 'peerName', {
        peer_id: peer_id_to_update,
        peer_name: peer_name_new,
      })
    }
  })

  /**
   * Relay Audio Video Hand ... Status to peers
   */
  socket.on('peerStatus', (config) => {
    let room_id = config.room_id
    let peer_name = config.peer_name
    let element = config.element
    let status = config.status

    for (let peer_id in peers[room_id]) {
      if (peers[room_id][peer_id]['peer_name'] == peer_name) {
        switch (element) {
          case 'video':
            peers[room_id][peer_id]['peer_video'] = status
            break
          case 'audio':
            peers[room_id][peer_id]['peer_audio'] = status
            break
          case 'hand':
            peers[room_id][peer_id]['peer_hand'] = status
            break
          case 'rec':
            peers[room_id][peer_id]['peer_rec'] = status
            break
        }
      }
    }

    log.debug(
      '[' + socket.id + '] emit peerStatus to [room_id: ' + room_id + ']',
      {
        peer_id: socket.id,
        element: element,
        status: status,
      },
    )

    sendToRoom(room_id, socket.id, 'peerStatus', {
      peer_id: socket.id,
      peer_name: peer_name,
      element: element,
      status: status,
    })
  })

  /**
   * Relay actions to peers or specific peer in the same room
   */
  socket.on('peerAction', (config) => {
    let room_id = config.room_id
    let peer_name = config.peer_name
    let peer_action = config.peer_action
    let peer_id = config.peer_id

    if (peer_id) {
      log.debug(
        '[' +
          socket.id +
          '] emit peerAction to [' +
          peer_id +
          '] from room_id [' +
          room_id +
          ']',
      )

      sendToPeer(peer_id, sockets, 'peerAction', {
        peer_name: peer_name,
        peer_action: peer_action,
      })
    } else {
      log.debug(
        '[' + socket.id + '] emit peerAction to [room_id: ' + room_id + ']',
        {
          peer_id: socket.id,
          peer_name: peer_name,
          peer_action: peer_action,
        },
      )

      sendToRoom(room_id, socket.id, 'peerAction', {
        peer_name: peer_name,
        peer_action: peer_action,
      })
    }
  })

  /**
   * Relay Kick out peer from room
   */
  socket.on('kickOut', (config) => {
    let room_id = config.room_id
    let peer_id = config.peer_id
    let peer_name = config.peer_name

    log.debug(
      '[' +
        socket.id +
        '] kick out peer [' +
        peer_id +
        '] from room_id [' +
        room_id +
        ']',
    )

    sendToPeer(peer_id, sockets, 'kickOut', {
      peer_name: peer_name,
    })
  })

  /**
   * Relay File info
   */
  socket.on('fileInfo', (config) => {
    let room_id = config.room_id
    let peer_name = config.peer_name
    let file = config.file

    function bytesToSize(bytes) {
      let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes == 0) return '0 Byte'
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    }

    file['peerName'] = peer_name

    log.debug(
      '[' +
        socket.id +
        '] Peer [' +
        peer_name +
        '] send file to room_id [' +
        room_id +
        ']',
      {
        peerName: file.peerName,
        fileName: file.fileName,
        fileSize: bytesToSize(file.fileSize),
        fileType: file.fileType,
      },
    )

    sendToRoom(room_id, socket.id, 'fileInfo', file)
  })

  /**
   * Abort file sharing
   */
  socket.on('fileAbort', (config) => {
    let room_id = config.room_id
    let peer_name = config.peer_name

    log.debug(
      '[' +
        socket.id +
        '] Peer [' +
        peer_name +
        '] send fileAbort to room_id [' +
        room_id +
        ']',
    )
    sendToRoom(room_id, socket.id, 'fileAbort')
  })

  /**
   * Relay video player action
   */
  socket.on('videoPlayer', (config) => {
    let room_id = config.room_id
    let peer_name = config.peer_name
    let video_action = config.video_action
    let video_src = config.video_src
    let peer_id = config.peer_id

    let sendConfig = {
      peer_name: peer_name,
      video_action: video_action,
      video_src: video_src,
    }
    let logme = {
      peer_id: socket.id,
      peer_name: peer_name,
      video_action: video_action,
      video_src: video_src,
    }

    if (peer_id) {
      log.debug(
        '[' +
          socket.id +
          '] emit videoPlayer to [' +
          peer_id +
          '] from room_id [' +
          room_id +
          ']',
        logme,
      )

      sendToPeer(peer_id, sockets, 'videoPlayer', sendConfig)
    } else {
      log.debug(
        '[' + socket.id + '] emit videoPlayer to [room_id: ' + room_id + ']',
        logme,
      )

      sendToRoom(room_id, socket.id, 'videoPlayer', sendConfig)
    }
  })

  /**
   * Whiteboard actions for all user in the same room
   */
  socket.on('wbCanvasToJson', (config) => {
    let room_id = config.room_id
    // log.debug('Whiteboard send canvas', config);
    sendToRoom(room_id, socket.id, 'wbCanvasToJson', config)
  })



  socket.on('chat', (data, callback)=>{
  console.log('server received from local client')
  //const {user, msg} = data
  return callback(data)
  //socket.emit('chat-response', {user: user, msg: msg})  
  })

  socket.on('whiteboardAction', (config) => {
    log.debug('Whiteboard', config)
    let room_id = config.room_id
    sendToRoom(room_id, socket.id, 'whiteboardAction', config)
  })
}) // end [sockets.on-connect]

/**
 * Send async data to all peers in the same room except yourself
 * @param {*} room_id id of the room to send data
 * @param {*} socket_id socket id of peer that send data
 * @param {*} msg message to send to the peers in the same room
 * @param {*} config JSON data to send to the peers in the same room
 */
async function sendToRoom(room_id, socket_id, msg, config = {}) {
  for (let peer_id in channels[room_id]) {
    // not send data to myself
    if (peer_id != socket_id) {
      await channels[room_id][peer_id].emit(msg, config)
    }
  }
}

/**
 * Send async data to specified peer
 * @param {*} peer_id id of the peer to send data
 * @param {*} sockets all peers connections
 * @param {*} msg message to send to the peer in the same room
 * @param {*} config JSON data to send to the peer in the same room
 */
async function sendToPeer(peer_id, sockets, msg, config = {}) {
  if (peer_id in sockets) {
    await sockets[peer_id].emit(msg, config)
  }
}
