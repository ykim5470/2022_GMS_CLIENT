import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import SetupBox from './SetupBox'
import Media from './Media'
import FeatureBar from './FeatureBar'
import ChatBox from './ChatBox'

const Stream = () => {
  const state = useSelector((state) => state)
  const dispatch = useDispatch()

  // Room Id from url params
  let { id } = useParams()

  useEffect(() => {
    // initClientPeer()
  }, [])

  state.signalingSocket.on('connect', () => {
    let myPeerId = state.signalingSocket.id
    console.log('Streamer peer id [ ' + myPeerId + ' ]')
  })

  state.signalingSocket.on('user', (data) => {
    console.log(data)
  })

  return (
    <div className='stream'>
      <SetupBox socket={state.signalingSocket} />
      <Media />
      <FeatureBar />
      <ChatBox />
    </div>
  )
}

export default Stream
