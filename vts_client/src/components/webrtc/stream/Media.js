import React, { useEffect, useState, useRef } from 'react'

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

  const videoRef = useRef({})

  useEffect(() => {
    if (localMedia && !videoRef.current.srcObject)
      videoRef.current.srcObject = localMedia

    // handleAddPeer
    signalingSocket.on('addPeer', (config) => {
      console.log('에드 피어가 2번 불리나?')
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
  }, [])

  return (
    <div className='media'>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  )
}

export default Media
