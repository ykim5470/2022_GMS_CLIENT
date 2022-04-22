import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 *
 * @param {socket instance, localMedia} props
 * @returns Media component
 */
const Media = (props) => {
  const signalingSocket = props.socket
  const localMedia = props.localMedia
  const peerConnections = useRef({})
  const peerConnection = useRef({})
  const chatDataChannels = useRef({})
  const description = useRef({})
  const preload = useRef({})
  const nickName = useRef('')
  const msgerInput = useRef('')
  // const [chatMessage,setChatMessage] = useState([])



  const videoRef = useRef({})

  const naviagte = useNavigate()

  useEffect(() => {
    if (localMedia && !videoRef.current.srcObject)
  

      videoRef.current.srcObject = localMedia
      var binaryData = []
      binaryData.push(localMedia)
      

      preload.current = window.URL.createObjectURL(new Blob(binaryData, {type: 'video/webm'}))
      console.log(preload)
      console.log(preload.current)

    // handleAddPeer
    signalingSocket.on('addPeer', (config) => {
      console.log(config)
      const { peer_id, peers, should_create_offer, iceServers } = config

      if (peer_id in peerConnections) {
        console.log('Already connected to peer', peer_id)
      }

      peerConnection.current = new RTCPeerConnection({ iceServers: iceServers })
      peerConnections.current = {
        [peer_id]: peerConnection.current,
      }

      console.log(peerConnections.current[peer_id])

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

      // handleOnIceCandidate(peer_id)
      peerConnections.current[peer_id].onicecandidate = (event) => {
        if (!event.candidate) return
        signalingSocket.emit('relayICE', {
          peer_id: peer_id,
          ice_candidate: {
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
          },
        })
      }

      // handleAddTracks(peer_id)
      localMedia.getTracks().forEach((track) => {
        peerConnections.current[peer_id].addTrack(track, localMedia)
      })

      // handlRtcOffer
      if (should_create_offer) {
        console.log('true인 경우에는 무조건 불려야한다. 즉, caller는 true이다.')
        peerConnections.current[peer_id].onnegotiationneeded = () => {
          console.log('Creating RTC offer to ', peer_id)
          peerConnections.current[peer_id]
            .createOffer()
            .then((local_description) => {
              console.log('Local offer description is', local_description)
              peerConnections.current[peer_id]
                .setLocalDescription(local_description)
                .then(() => {
                  signalingSocket.emit('relaySDP', {
                    peer_id: peer_id,
                    session_description: local_description,
                  })
                  console.log('Offer setLocalDescription done!')
                })
                .catch((err) => {
                  console.error('[Error] offer setLocalDescription', err)
                })
            })
            .catch((err) => {
              console.error('[Error] sending offer', err)
            })
        }
      }

      // Secure RTC Data Channel 
      peerConnections.current[peer_id].ondatachannel =(event) =>{
        console.log('handleRTCDataChannels' + peer_id , event)
        event.channel.onmessage = (msg) =>{
          switch(event.channel.label){
            case 'chatChannel':
              try{
                let dataMessage = JSON.parse(msg.data)
                switch(dataMessage.type){
                  case 'chat':
                    handleDataChannelChat(dataMessage)
                    break
                  case 'speech':
                    break
                  case 'micVolume':
                    break
                }
              }catch(err){
                console.error('chat channel error' , err)
              }
              break
            case 'fileSharing':
              try{
                let dataFile = msg.data
                //handleDataChannelFileSharing(dataFile)
              }catch(err){
                console.error('file sharing channel error',err)
              }
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

    signalingSocket.on('iceCandidate', (config) => {
      const { peer_id, ice_candidate } = config
      peerConnections.current[peer_id]
        .addIceCandidate(new RTCIceCandidate(ice_candidate))
        .catch((err) => {
          console.error('[Error] addIceCandidate', err)
        })
    })

    signalingSocket.on('sessionDescription', (config) => {
      const { peer_id, session_description } = config
      console.log(peerConnections.current[peer_id].signalingState)
      console.log(
        '여기서 불리는 config는 가장 마지막으로 user local sdp answer를 check하는 용도',
      )
      console.log(config)

      description.current = new RTCSessionDescription(session_description)

      peerConnections.current[peer_id]
        .setRemoteDescription(description.current)
        .then(() => {
          console.log('setRemoteDescription done!')
        })
        .catch((err) => {
          console.error('[Error] setRemoteDescription', err)
        })
    })


    signalingSocket.on('removePeer', (config) =>{
      console.log('Signaling server said to remove peer:' , config)

      const {peer_id} = config.peer_id
      if(peer_id in peerConnections.current) peerConnections.current[peer_id].close()
      
      delete peerConnections.current[peer_id]
    })


    signalingSocket.on('handleDisconnect', (reason)=>{
      console.log('Disconnected from signaling server', {reason: reason})
      for(let peer_id in peerConnections.current){
        peerConnections.current[peer_id].close()
      }
      peerConnections.current = {}

      // emit to server update live room activate status 


      // redirect to guide's landing page 
      naviagte('/guide1/landing', {replace: true})

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
  sendToDataChannel(chatMessage)
}

/**
 * Send async data through RTC Data Channels 
 * @param {*} config object data
 */
async function sendToDataChannel(config){
  console.log(chatDataChannels.current)
  
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

  emitMsg('guide1', 'toAll', msg.current, false)
  msg.current = ''
}

/**
 * handle Incoming Data Channel Chat Messages 
 * @param {*} dataMessage
 */
 function handleDataChannelChat(dataMessage){
  if(!dataMessage)return 

  let msgFrom = dataMessage.from
  let msgTo = dataMessage.to
  let msg = dataMessage.msg
  let msgPrivate = dataMessage.privateMsg

  console.log('handleDataChannelChat', dataMessage)

  // console.log(chatDataChannels.current)
  // setChatMessage(chatDataChannels.current)
  // append message
}



  return (
    <div className='media'>
            {/* Video */}
      <video ref={videoRef} autoPlay playsInline muted />

            {/* Chatting */}
            <div className='wrapper'>
        <div className='display-container'>
          <ul className='chatting-list'>
          <li>
              {/* {chatMessage.map(msgObj => {return <div>msgObj.msg</div>})} */}
            </li>
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










export default Media
