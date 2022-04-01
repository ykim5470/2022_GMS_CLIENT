import React, { useEffect, useState, useRef } from 'react'
import { GetFetchQuotes } from '../../../api/fetch'
import { useSelector, useDispatch } from 'react-redux'

/**
 *
 * @param {socket instance} props
 * @returns Content component
 */
const Content = (props) => {
  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  console.log(state.roomContents)
  const [contents, setContents] = useState([])

  useEffect(() => {
    GetFetchQuotes({
      uri: 'http://localhost:4001/roomList',
      msg: 'GET current Room Contents information',
    }).then((result) => {
      console.log(result)
      setContents(result)
    })
  }, [state.roomContents])

  const signalingSocket = props.socket

  signalingSocket.on('aaa', (data) => {
    console.log(data)
    console.log('받음')
  })

  const joinRoom = (event) => {
    console.log('join room')

    event.preventDefault()
  }

  return (
    <div className='content'>
      <form onSubmit={joinRoom}>
        {contents.map((el, idx) => {
          return <div key={idx}>{el.title}</div>
        })}
        <label>Dummy thumbnail</label>
        <br />
        <label>Dummy content title</label>
        <br />

        <input type='submit' value='join' />
      </form>
    </div>
  )
}

export default Content
