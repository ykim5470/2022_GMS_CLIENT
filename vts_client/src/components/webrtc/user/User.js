import React, {  useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Content from './Content'

const User = () => {

  const [myPeerId, setMyPeerId] = useState('')
  const [socketId , setSocketId] = useState('')

  return <div className='userList'>{<Content socket={socketId}/>}</div>
}

export default User
