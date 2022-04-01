import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Content from './Content'

const User = () => {
  const state = useSelector((state) => state)

  state.signalingSocket.on('connect', () => {
    let myPeerId = state.signalingSocket.id
    console.log('User peer id [ ' + myPeerId + ' ]')
  })

  return (
    <div className='user'>
      <Content socket={state.signalingSocket} />
    </div>
  )
}

export default User
