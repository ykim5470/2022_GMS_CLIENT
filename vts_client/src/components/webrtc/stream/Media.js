import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'


import { audioUpdate, videoUpdate, audioConstraintUpdate, videoConstraintUpdate, updateLocalMedia } from '../../../redux/thunk'

import {PostFetchQuotes} from '../../../api/fetch'
import DetectRTC from 'detectrtc'

import { ToggleButtonGroup, ToggleButton } from '@mui/material'



/**
 *
 * @param {socket instance} props
 * @returns Media component
 */
const Media = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  // Audio & Media constraint
  const mediaConstraintsState = state.mediaConstraints
  const muteRef = useRef(true)
  // WebRTC handling
  const signalingSocket = props.socket
  const peerConnections = useRef({})
  const peerConnection = useRef({})
  const description = useRef({})
  // chat
  const nickName = useRef('')
  const msgerInput = useRef('')
  const [chatMessage,setChatMessage] = useState([])
  // camera mode
  const cameraMode = useRef('user')
  // room id
  const { id } = useParams()
  const roomId = id
  

  const videoRef = useRef({})

  const naviagte = useNavigate()

  useEffect(() => {

      videoRef.current.srcObject = state.localMediaStream
      muteRef.current = false 

      
    //   var binaryData = []
    //   // binaryData.push(localMedia)
      

    //   preload.current = window.URL.createObjectURL(new Blob(binaryData, {type: 'video/webm'}))
    //   console.log(preload)
    //   console.log(preload.current)

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
      state.localMediaStream.getTracks().forEach((track) => {
        peerConnections.current[peer_id].addTrack(track, state.localMediaStream)
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
    // uri: `${process.env.REACT_APP_LOCAL_IP}/createChatLog`,
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

  setChatMessage(
    chatMessage => [...chatMessage, msg.current]
  )
}


const myBrowserName = DetectRTC.browser.name

const videoConstraints = myBrowserName ==='Firefox' ? getVideoConstraints('default', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo) : getVideoConstraints('useVideo', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo)
  

const constraints = {
  audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
    video: videoConstraints,
   }

/**
 * Check if there is peer connections
 * @returns truee, false 
 */
  const thereisPeerConnections = () =>{
    if(Object.keys(peerConnections.current).length === 0) return false
      return true
  }

/**
 * Stop local video track 
 * @returns Sender video track stop & update gloabl localMedia status  
 */
const stopLocalVideoTrack  = () =>{
  return state.localMediaStream.getVideoTracks()[0].stop()
}

// Swap Camera 
const swapCamera = () =>{
  console.log(cameraMode.current)
  // setup camera 
  cameraMode.current  = cameraMode.current === 'user' ? 'environment' : 'user'
   dispatch(videoConstraintUpdate({facingMode: {exact: cameraMode.current}})) // pass camera mode config to constraint 

  // some devices can't swap the cam, if have Video Track already in execution 
  if(mediaConstraintsState.useVideo) stopLocalVideoTrack()

  console.log(constraints)

  navigator.mediaDevices.getUserMedia(constraints)
  .then((camStream)=> {
    console.log(camStream)
    refreshMyStreamToPeers(camStream)
    refreshMyLocalStream(camStream)
    if(mediaConstraintsState.useVideo) setMyVideoStatusTrue()
  }).catch((err)=>{
    console.log('[Error] to swapping camera', err)
  })
}

/**
 * Refresh my stream changes to connected peers in the room 
 * @param {*} stream 
 * @param {*} localAudioTrackChange ture or false(default)
 */
 const refreshMyStreamToPeers = (stream, localAudioTrackChange=false) =>{
  if(!thereisPeerConnections()) return 
  console.log(peerConnections.current)

  // refresh my stream to peers 
  for(let peer_id  in peerConnections.current){
    let videoSender = peerConnections.current[peer_id].getSenders().find((s)=>(s.track? s.track.kind ==='video' : false))
    videoSender.replaceTrack(stream.getVideoTracks()[0])
  }
}

/**
 * Refresh my local stream 
 * @param {*} stream
 * @param {*} localAudiotrackChange true or false(default)
 */
const refreshMyLocalStream = (stream, localAudioTrackChange=false) =>{
  stream.getVideoTracks()[0].enabled = true 
  // update global as well 
  console.log(stream) // renewed stream
  dispatch(updateLocalMedia(stream))
   videoRef.current.srcObject = stream
   muteRef.current = false 

}

const setMyVideoStatusTrue = () =>{}


/**
 * Switch on-off audio
 */
const audioController = () =>{  
  const currentAudioOption = !mediaConstraintsState.myAudioStatus
  dispatch(audioUpdate(currentAudioOption)) 
  state.localMediaStream.getAudioTracks()[0].enabled = currentAudioOption

}

/**
 * Switch on-off video 
 */
const videoController =()=>{
  const currentVideoOption = !mediaConstraintsState.myVideoStatus
  dispatch(videoUpdate(currentVideoOption))
  state.localMediaStream.getVideoTracks()[0].enabled = currentVideoOption

}


  return (
    <div className='media'>
      {/* Video */}
      <video ref={videoRef} autoPlay playsInline muted={muteRef.current} />

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
      {/* Swap Camera */}
      <div className='swap-camera'> 
        <button className='swapCameraBtn' onClick={swapCamera}>
          카메라 전환
        </button>
      </div>
      {/* MediaController */}
      <ToggleButtonGroup onClick={videoController} aria-label='video toggle'>
          {mediaConstraintsState.myVideoStatus ?           
          (<ToggleButton value={mediaConstraintsState.myVideoStatus} aria-label='video off'>
            video off 
          </ToggleButton>)
           :       
            (<ToggleButton value={mediaConstraintsState.myVideoStatus} aria-label='video on'>
            video on 
          </ToggleButton>)}
        </ToggleButtonGroup>

        <ToggleButtonGroup onClick={audioController} aria-label='video toggle'>
          {mediaConstraintsState.myAudioStatus ?           
          (<ToggleButton value={mediaConstraintsState.myAudioStatus} aria-label='audio off'>
            audio off 
          </ToggleButton>)
          : 
         (<ToggleButton value={mediaConstraintsState.myAudioStatus} aria-label='audio on'>
          audio on 
        </ToggleButton>)
         }
        </ToggleButtonGroup>

    </div>
  )
}










export default Media


/**
* https://webrtc.github.io/samples/src/content/getusermedia/resolution/
*/
function getVideoConstraints(vidoeQuality, videoMaxFrameRate, useVideo){
  let frameRate = { max: videoMaxFrameRate }
  switch (vidoeQuality) {
    case 'useVideo':
      return useVideo

    case 'default':
      // Firefox not support set frameRate (OverconstrainedError) O.o
      return { frameRate: frameRate } 
    // video cam constraints default
    case 'qvgaVideo':
      return {
        width: { exact: 320 },
        height: { exact: 240 },
        frameRate: frameRate,
      } // video cam constraints low bandwidth
    case 'vgaVideo':
      return {
        width: { exact: 640 },
        height: { exact: 480 },
        frameRate: frameRate,
      } // video cam constraints medium bandwidth
    case 'hdVideo':
      return {
        width: { exact: 1280 },
        height: { exact: 720 },
        frameRate: frameRate,
      } // video cam constraints high bandwidth
    case 'fhdVideo':
      return {
        width: { exact: 1920 },
        height: { exact: 1080 },
        frameRate: frameRate,
      } // video cam constraints very high bandwidth
    case '4kVideo':
      return {
        width: { exact: 3840 },
        height: { exact: 2160 },
        frameRate: frameRate,
      } // video cam constraints ultra high bandwidth
  default: 
      return
  }
}