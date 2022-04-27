import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DetectRTC from 'detectrtc'
import {PostFetchQuotes} from '../../../api/fetch'
import axios from 'axios'
import { dblClick } from '@testing-library/user-event/dist/click'
import { modalClasses } from '@mui/material'


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
  const videoRef = useRef({})
  const muteRef = useRef(true)
  const nickName = useRef('')
  const msgerInput = useRef('')
  const [chatMessage,setChatMessage] = useState([])


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
        muteRef.current = false 
      }
    })

    // socket chat Receive 
    state.signalingSocket.on('receiveChat', (data)=>{
      const {from, msg} = data
      console.log("This message is from :" +from)
      console.log('The message is :' + msg)
      console.log(chatMessage)
      setChatMessage(
        chatMessage => [...chatMessage, msg]
      )
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
 * Send Chat messages to peers in the room
 */
async function sendChatMessage(){
  const msg = msgerInput


  await PostFetchQuotes({
    uri: `${process.env.REACT_APP_PUBLIC_IP}/createChatLog`,
    // uri: `${process.env.REACT_APP_LOCAL_IP}/createChatLog`,
    body: {
      RoomId: roomId, 
      User: state.signalingSocket.id, 
      Text: msgerInput.current
    },
    msg: 'Create Chat Data Log'
  })
  

  state.signalingSocket.emit('chatting', (
    {
      channel: roomId,
      peer_id: state.signalingSocket.id, 
      msg: msgerInput.current}
  ))

  console.log(chatMessage)
  setChatMessage(
    chatMessage => [...chatMessage, msg.current]
  )
}

console.log(chatMessage)



  return (
    <div className='user'>
      view page
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




