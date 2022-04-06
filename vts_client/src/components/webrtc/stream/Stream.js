import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import SetupBox from './SetupBox'
import Media from './Media'
import FeatureBar from './FeatureBar'
import ChatBox from './ChatBox'

const Stream = () => {
  const state = useSelector((state) => state)
  const dispatch = useDispatch()

  // const [localMediaStream, setLocalMediaStream] = useState(null)
  const [myPeerId, setMyPeerId] = useState('')
  // const peerConnections = useRef({})
  // const peerConnection = useRef({})
  // const localMedia = useRef({})

  // Room Id from url params
  let { id } = useParams()

  // useEffect(() => {
  //   localMedia.current = state.localMediaStream
  // }, [state.localMediaStream])

  state.signalingSocket.on('connect', () => {
    // set peer id when client connects to the server
    setMyPeerId(state.signalingSocket.id)
  })

  // localMedia를 set한 이후의 업데이트 완료
  console.log('Streamer peer id [ ' + myPeerId + ' ]')
  console.log(state.localMediaStream)

  // handleSessionDescription

  // handleIceCandidate

  // handlePeerStatus

  // handleDisconnect

  // handleRemovePeer

  if (state.localMediaStream === null) {
    return <SetupBox socket={state.signalingSocket} />
  } else {
    return (
      <div>
        셋업 먼저 거쳤다가 옴
        <Media
          socket={state.signalingSocket}
          localMedia={state.localMediaStream}
        />
        <FeatureBar />
        <ChatBox />
      </div>
    )
  }
}

export default Stream
