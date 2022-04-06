import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
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
  const state = useSelector((state) => state)
  const [myPeerId, setMyPeerId] = useState('')
  const [stateRemoteStream, setStateRemoteStream] = useState({})
  // const [peerConnection, setPeerConnection] = useState('')
  // const [peerConnections, setPeerConnections] = useState({})
  const description = useRef({})
  const peerConnection = useRef({})
  const peerConnections = useRef({})
  const videoRef = useRef({})

  const { id } = useParams()
  const roomId = id

  useEffect(() => {
    getPeerGeoLocation()
    setMyPeerId(state.signalingSocket.id)
    if (Object.keys(stateRemoteStream).length !== 0) {
      console.log(stateRemoteStream)
      videoRef.current.srcObject = stateRemoteStream
    }
  }, [stateRemoteStream])

  /**
   * handleConnect
   * join to channel and send some peer info
   */
  if (myPeerId !== '') {
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
  }

  /**
   * handleAddPeer
   */
  state.signalingSocket.on('addPeer', (config) => {
    const { peer_id, peers, should_create_offer, iceServers } = config
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
      setStateRemoteStream(event.streams[0])
      // useEffect(() => {
      //   videoRef.current.srcObject = event.streams[0]
      // })
      // videoRef.current.srcObject = event.streams[0]
    }
  })

  state.signalingSocket.on('sessionDescription', (config) => {
    const { peer_id, session_description } = config
    console.log(session_description)
    console.log(session_description.type)
    console.log(peerConnections.current[peer_id.signalingState])

    if (peerConnections.current[peer_id].signalingState !== undefined) {
      description.current = new RTCSessionDescription(session_description)

      if (peerConnections.current[peer_id].signalingState === 'stable') return

      console.log('여긴 와야지')
      peerConnections.current[peer_id]
        .setRemoteDescription(description.current)
        .then(() => {
          console.log('setRemoteDescription done!')
          if (session_description.type === 'offer') {
            console.log('Creating answer')
            peerConnections.current[peer_id]
              .createAnswer()
              .then((local_description) => {
                console.log('Answer description is: ', local_description)
                console.log(peerConnections.current[peer_id])
                peerConnections.current[peer_id]
                  .setLocalDescription(local_description)
                  .then(() => {
                    state.signalingSocket.emit('relaySDP', {
                      peer_id: peer_id,
                      session_description: local_description,
                    })
                    console.log('Answer setLocalDescription done!')
                    return
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
    } else {
      return
    }
  })

  state.signalingSocket.on('iceCandidate', (config) => {
    const { peer_id, ice_candidate } = config
    peerConnections.current[peer_id]
      .addIceCandidate(new RTCIceCandidate(ice_candidate))
      .catch((err) => {
        console.error('[Error] addIceCandidate', err)
      })
  })

  return (
    <div className='user'>
      view page
      <video ref={videoRef} autoPlay playsInline muted />
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
