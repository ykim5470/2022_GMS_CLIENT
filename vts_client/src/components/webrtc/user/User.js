import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
// import { io } from 'socket.io-client'

import Content from './Content'

const signalingServerPort = 4001
const signalingServer = 'http://localhost:4001'

let a = io(signalingServer)
console.log(a)

const User = () => {
  // io.on('connect', () => {
  //   let myPeerId = io.id
  //   console.log('User peer id [ ' + myPeerId + ' ]')
  // })

  return (
    <div className='user'>
      <Content />
    </div>
  )
}

export default User
