import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import DetectRTC from 'detectrtc'
import { toHaveDescription } from '@testing-library/jest-dom/dist/matchers'

const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/?key=demo2'

const peerInfo = getPeerInfo()
let peerGeo
let myVideoStatus = false
let myAudioStatus = false
let isRecScreenSream = false

// let peerConnection
// let peerConnections = {}
// let remoteMediaStream

const View = () => {
  const navigate = useNavigate()
  const state = useSelector((state) => state)
  // const [myPeerId, setMyPeerId] = useState('')
  const myPeerId = useRef({})
  // const [stateRemoteStream, setStateRemoteStream] = useState({})
  // const [peerConnection, setPeerConnection] = useState('')
  // const [peerConnections, setPeerConnections] = useState({})
  const description = useRef({})
  const peerConnection = useRef({})
  const peerConnections = useRef({})
  const chatDataChannels = useRef({})
  const videoRef = useRef({})
  const nickName = useRef('')
  const msgerInput = useRef('')
  const [chatMessages,setChatMessages] = useState([])


  const { id } = useParams()
  const roomId = id
  console.log(roomId)

  useEffect(() => {
    getPeerGeoLocation()
    state.signalingSocket.emit('join', {
      channel: roomId,
      peer_info: peerInfo,
      peer_role: 'user',
      peer_geo: peerGeo,
      peer_name: 'user1',
      peer_video: myVideoStatus,
      peer_audio: myAudioStatus,
      peer_hand: false,
      peer_rec: isRecScreenSream,
    })

    /**
     * handleAddPeer
     */
    state.signalingSocket.on('addPeer', (config) => {
      const { peer_id, peers, should_create_offer, iceServers } = config
      console.log(config)
      console.log('This one should be the first one id')
      if (peer_id in peerConnections) {
        console.log('Already connected to peer', peer_id)
        return
      }
      peerConnection.current = new RTCPeerConnection({ iceServers: iceServers })

      peerConnections.current = {
        [peer_id]: peerConnection.current,
      }

      // handlePeersConnectionStatus(peer_id)
      peerConnections.current[peer_id].onconnectionstatechange = function (
        event,
      ) {
        const connectionStatus = event.currentTarget.connectionState
        console.log('Connection', {
          peer_id: peer_id,
          connectionStatus: connectionStatus,
        })
      }

      // handlOnIceCandidate(peer_id)
      peerConnections.current[peer_id].onicecandidate = (event) => {
        if (!event.candidate) return
        state.signalingSocket.emit('relayICE', {
          peer_id: peer_id,
          ice_candidate: {
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
          },
        })
      }
      // handleOnTrack(peer_id, peers)
      console.log('=============receive test')
      peerConnections.current[peer_id].ontrack = (event) => {
        console.log('handleOnTrack', event)
        console.log(event.streams[0])
        // setStateRemoteStream(event.streams[0])
        // useEffect(() => {
        //   videoRef.current.srcObject = event.streams[0]
        // })
        videoRef.current.srcObject = event.streams[0]
      }

      // handleRTCDataChannel(peer_id)
      peerConnections.current[peer_id].ondatachannel = (event)=>{
        console.log('handleRTCDataChannel'+ peer_id, event)
        event.channel.onmessage =(msg)=>{
          switch(event.channel.label){
            case 'chatChannel':
              try{
                let dataMessage = JSON.parse(msg.data)
                console.log(dataMessage)
                switch(dataMessage.type){
                  case 'chat':
                    handleDataChannelChat(dataMessage)
                    break
                  case 'speech':
                    console.log('speech')
                    break
                  case 'micVolume':
                    console.log('mic volume')
                    break
                  default:
                    return
                }
              }catch(err){
                console.error('chat channel error', err)
              }
            case 'fileSharing':
                try{
                  let dataFile = msg.data
                  // handleDataChannelFileSharing(dataFile)
                  return 
                }catch(err){
                  console.error('file sharing channel error', err)
                }
              default:
                  return
          }
        }
      }

      // createChatDataChannel(peer_id)
      chatDataChannels.current[peer_id] = peerConnections.current[peer_id].createDataChannel(
        'chatChannel'
      )
      chatDataChannels.current[peer_id].onopen = (event) =>{
        console.log('chatDataChannels created', event)
      }
      // createFileSharingDataChannel(peer_id)

    })

    // handleAddPeer
    state.signalingSocket.on('iceCandidate', (config) => {
      const { peer_id, ice_candidate } = config
      peerConnections.current[peer_id]
        .addIceCandidate(new RTCIceCandidate(ice_candidate))
        .catch((err) => {
          console.error('[Error] addIceCandidate', err)
        })
    })

    state.signalingSocket.on('sessionDescription', (config) => {
      const { peer_id, session_description } = config
      console.log(session_description)
      console.log(session_description.type)
      console.log(peerConnections.current[peer_id].signalingState)

      let description = new RTCSessionDescription(session_description)

      console.log('여긴 와야지')
      peerConnections.current[peer_id]
        .setRemoteDescription(description)
        .then(() => {
          console.log('setRemoteDescription done!')
          if (session_description.type == 'offer') {
            console.log('Creating answer')
            peerConnections.current[peer_id]
              .createAnswer()
              .then((local_description) => {
                console.log('Answer description is: ', local_description)
                console.log(peerConnections.current[peer_id])

                peerConnections.current[peer_id]
                  .setLocalDescription(local_description)
                  .then(() => {
                    {
                      state.signalingSocket.emit('relaySDP', {
                        peer_id: peer_id,
                        session_description: local_description,
                      })
                      console.log('Answer setLocalDescription done!')
                      return
                    }
                    // console.log(result) // check local answer sdp is called in wrong state : stable
                  })
                  .catch((err) => {
                    console.error('[Error] answer setLocalDescription', err)
                  })
              })
              .catch((err) => {
                console.error('[Error] creating answer', err)
              })
          }
        })
        .catch((err) => {
          console.error('[Error] setRemoteDescription', err)
        })
    })


    // handleRemovePeer
    state.signalingSocket.on('removePeer', (config) =>{
      console.log('Signaling server said to remove peer:' , config)

      const {peer_id} = config.peer_id
      if(peer_id in peerConnections.current) peerConnections.current[peer_id].close()
      
      delete peerConnections.current[peer_id]

      // alert and redirect handling required!      
      navigate('/user', {replace: true}) 
    })
  }, [])

  


      /**
 * Send message over Secure dataChannels
 * @param {*} from
 * @param {*} to
 * @param {*} msg
 * @param {*} privateMsg ture/false
 */
function emitMsg(from, to, msg, privateMsg){
  if(!msg)return 
  let chatMessage = {
    type: 'chat',
    from: from, 
    to: to, 
    msg: msg,
    privateMsg: privateMsg
  }
  console.log('Send msg', chatMessage)
  setChatMessages(prevState => [
    ...prevState, chatMessage
  ]
  )
  sendToDataChannel(chatMessage)
}

/**
 * Send async data through RTC Data Channels 
 * @param {*} config object data
 */
async function sendToDataChannel(config){
  // console.log(chatDataChannels.current)
  // setChatMessage(...chatDataChannels.current)
  
  for(let peer_id in chatDataChannels.current){
    if(chatDataChannels.current[peer_id].readyState ==='open'){
      await chatDataChannels.current[peer_id].send(JSON.stringify(config))
    }
  }
}

/**
 * Send Chat messages to peers in the room
 */
function sendChatMessage(){
  const msg = msgerInput

  emitMsg('user1', 'toAll', msg.current, false)

  // appendMessage('user1', 'avatar', 'right', msg, false)
  msg.current = ''
}

/**
 * handle Incoming Data Channel Chat Messages 
 * @param {*} dataMessage
 */
 function handleDataChannelChat(dataMessage){
  if(!dataMessage)return 

  console.log('이건 스트리머 쪽에서 채팅을 쳤을 때 불린다.')
  let msgFrom = dataMessage.from
  let msgTo = dataMessage.to
  let msg = dataMessage.msg
  let msgPrivate = dataMessage.privateMsg

  console.log('handleDataChannelChat', dataMessage)

  setChatMessages(prevState => [
    ...prevState, dataMessage
  ]
  )


}




  return (
    <div className='user'>
      view page
      {/* Video */}
      <video ref={videoRef} autoPlay playsInline muted />
      {/* Chatting */}
      <div className='wrapper'>
        <div className='display-container'>
          <ul className='chatting-list'>
  
              {chatMessages.map((msgObj,idx) => {return <li key={idx}><span>{msgObj.from}: </span>{msgObj.msg}</li>})}
          </ul>
        </div>
        <div className='user-container'>
          <label htmlFor='nickName'>이름 :</label>
          <input type='text' ref={nickName}/>
        </div>
        <div className='input-container'/>
          <span>
            <input type='text' className='chatting-input' ref={msgerInput} onChange={(e)=>{msgerInput.current = e.target.value}}/>
            <button className='send-button' onClick={sendChatMessage}>전송</button>
          </span>
      </div>
    </div>
  )
}

export default View

/**
 * Get peer info using DetecRTC
 * https://github.com/muaz-khan/DetectRTC
 * @returns Obj peer info
 */
function getPeerInfo() {
  return {
    detectRTCversion: DetectRTC.version,
    isWebRTCSupported: DetectRTC.isWebRTCSupported,
    isMobileDevice: DetectRTC.isMobileDevice,
    osName: DetectRTC.osName,
    osVersion: DetectRTC.osVersion,
    browserName: DetectRTC.browser.name,
    browserVersion: DetectRTC.browser.version,
  }
}

/**
 * Get approximative peer geolocation
 * @returns json
 */
function getPeerGeoLocation() {
  fetch(peerLoockupUrl)
    .then((res) => res.json())
    .then((outJson) => {
      peerGeo = outJson
    })
    .catch((err) => console.error(err))
}




