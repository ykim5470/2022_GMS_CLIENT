import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Content from './Content'

const User = () => {
  const state = useSelector((state) => state)

  return (
    <div className='user'>
      <Content />
    </div>
  )
}

export default User
