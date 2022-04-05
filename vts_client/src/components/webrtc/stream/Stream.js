import React, { useEffect, useState } from 'react'
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
  const [peerConnections, setPeerConnections] = useState({})
  const [peerConnection, setPeerConnection] = useState()

  // Room Id from url params
  let { id } = useParams()

  useEffect(() => {}, [state.localMediaStream])

  state.signalingSocket.on('connect', async () => {
    // set peer id when client connects to the server
    setMyPeerId(state.signalingSocket.id)
  })

  // localMedia를 set한 이후의 업데이트 완료
  console.log('Streamer peer id [ ' + myPeerId + ' ]')
  console.log(state.localMediaStream)

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
