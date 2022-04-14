import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Content from './Content'

const User = () => {
  const state = useSelector((state) => state)

  // const { id } = useParams
  // console.log(id)

  const [myPeerId, setMyPeerId] = useState('')
  const [socketId , setSocketId] = useState('')


  // state.signalingSocket.on('connect', setMyPeerId(state.signalingSocket.id))

  // console.log(myPeerId)
  // useEffect(() => {
  //   state.signalingSocket.on('connect', () => {
  //     setMyPeerId(state.signalingSocket.id)
  //   })
  // }, [])

  // console.log('User peer id [ ' + myPeerId + ' ]')

  // state.signalingSocket.on('connect', () => {
  //   // set peer id when client connects to the server
  //   setMyPeerId(state.signalingSocket.id)
  // })

  // if (myPeerId === '') {
  //   return <div className='loading'>Loading</div> // Lazy load required
  // } else {
  //   return <div className='user'>{<Content />}</div>
  // }
  return <div className='userList'>{<Content socket={socketId}/>}</div>
}

export default User
