import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {PostFetchQuotes} from '../../../api/fetch'

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
  const description = useRef({})
  const preload = useRef({})
  const nickName = useRef('')
  const msgerInput = useRef('')
  const cameraMode = useRef('user')
  const { id } = useParams()
  const roomId = id
  const [chatMessage,setChatMessage] = useState([])
  



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

    })


    signalingSocket.on('receiveChat', (data) =>{
      const {from, msg} = data 
      console.log('This message is from :' + from)
      console.log('The message is :'+msg)
      setChatMessage(
        chatMessage => [...chatMessage, msg]
      )
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
 * Send Chat messages to peers in the room
 */
async function sendChatMessage(){
  const msg = msgerInput

  await PostFetchQuotes({
    uri: `${process.env.REACT_APP_PUBLIC_IP}/createChatLog`,
    body: {
      RoomId: roomId, 
      User: signalingSocket.id, 
      Text: msgerInput.current
    },
    msg: 'Create Chat Data Log'
  })

  signalingSocket.emit('chatting', (
    {
      channel: roomId,
      peer_id: signalingSocket.id, 
      msg: msgerInput.current}
  ))

  console.log(chatMessage)


  setChatMessage(
    chatMessage => [...chatMessage, msg.current]
  )
}


// 카메라 전환
const swapCamera = () =>{
  
}


// /**
//  * Check if can swap or not the cam, if yes show the button else hide it  
// * */
// function setSwapCameraBtn(){
//   navigator.mediaDevices.enumerateDevices().then(devices => {
//     const videoInput = devices.filter(device => device.kind ==='videoinput')
//     if(videoInput.length > 1 && isMobileDevice){
//       setSwapCameraBtn.addEventListener('click', e =>{
//         swapCamera()
//       })
//     }else{
//       setSwapCameraBtn.style.display = 'none'
//     }
//   })
// } 



  return (
    <div className='media'>
      {/* Video */}
      <video ref={videoRef} autoPlay playsInline muted />

      {/* Chatting */}
      <div className='wrapper'>
        <div className='display-container'>
          <ul className='chatting-list'>
              {chatMessage.map((msgObj,idx) => {return <li key={idx}>{msgObj}</li>})}
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
      {/* MediaControl */}
      <div className='mediaController'> 
        <button className='swapCameraBtn' ref={cameraMode} onClick={swapCamera}>
          카메라 전환
        </button>
        
      </div>
    </div>
  )
}










export default Media
