import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

import SetupBox from './SetupBox'
import Media from './Media'
import FeatureBar from './FeatureBar'
import ChatBox from './ChatBox'

const signalingServerPort = 4001
const signalingServer = 'http://localhost:4001'

let signalingSocket = io(signalingServer, {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'webrtcSocketFromClient',
  },
})

const Stream = () => {
  // Room Id from url params
  let { id } = useParams()

  useEffect(() => {
    // initClientPeer()
  }, [])

  signalingSocket.on('connect', () => {
    let myPeerId = signalingSocket.id
    console.log('Streamer peer id [ ' + myPeerId + ' ]')
  })

  return (
    <div className='stream'>
      <SetupBox socket={signalingSocket} />
      <Media />
      <FeatureBar />
      <ChatBox />
    </div>
  )
}

export default Stream
