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

  let localMediaStream

  // Room Id from url params
  let { id } = useParams()

  useEffect(() => {
    // initClientPeer()
  }, [])

  state.signalingSocket.on('connect', () => {
    let myPeerId = state.signalingSocket.id
    console.log('Streamer peer id [ ' + myPeerId + ' ]')
  })

  function setupLocalMedia(callback, errorback) {
    if (localMediaStream != null) {
      if (callback) callback()
      return
    }
    console.log('Requesting access to local audio / video inputs')
    navigator.mediaDevices.getUserMedia()
  }

  return (
    <div className='stream'>
      if(localMediaStream){<SetupBox socket={state.signalingSocket} />}
      else
      {setupLocalMedia(() => {
        whoAreYou()
      })}
      <Media socket={state.signalingSocket} />
      <FeatureBar />
      <ChatBox />
    </div>
  )
}

export default Stream
