import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GetFetchQuotes } from '../../../api/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { roomAdd } from '../../../redux/thunk'

/**
 *
 * @param {socket instance} props
 * @returns Content component
 */
const Content = (props) => {
  console.log('-aaaaa')
  const navigate = useNavigate()

  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const [contents, setContents] = useState([])

  const joinRoom = (e) => {
    const roomId = e.target.value
    navigate(roomId)

    e.preventDefault()
  }

  useEffect(() => {
    GetFetchQuotes({
      uri: 'http://88d1-211-171-1-210.ngrok.io/roomList',
      msg: 'GET current Room Contents information',
    }).then((result) => {
      console.log(result)
      setContents(result)
    })
  }, [state.roomContents])

  return (
    <div className='content'>
      {contents.map((el, idx) => {
        return (
          <form key={idx}>
            <div>
              {el.title}
              <br />
              <button type='button' onClick={joinRoom} value={el.roomId}>
                join
              </button>
            </div>
          </form>
        )
      })}
    </div>
  )
}

export default Content
