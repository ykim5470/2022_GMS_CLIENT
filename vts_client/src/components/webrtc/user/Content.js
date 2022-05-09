import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GetFetchQuotes } from '../../../api/fetch'
import { useSelector } from 'react-redux'


const Content = (props) => {
  const navigate = useNavigate()


  const state = useSelector((state) => state)
  const [contents, setContents] = useState([])



  const joinRoom = (e) => {
    const roomId = e.target.value
    return navigate(`/view/${roomId}`, { replace: true })

  }

  useEffect(() => {
     GetFetchQuotes({
      uri: process.env.REACT_APP_LOCAL_IP + '/roomList',
      msg: 'GET current Room Contents information',
    }).then((result) => {
      setContents(result)
    })
  }, [state.roomContents])

  
  if (contents.length !== 0) {
    return (
      <div className='content'>
        {contents.map((el, idx) => 
        {
          let thumnail = `${process.env.REACT_APP_LOCAL_IP}/uploads/${el.setConfig[0].Thumbnail}`

          return (
            <form key={idx}>
          <img width={100} height={50}alt='thumbnail' src={thumnail} />
              <div>
                {el.setConfig[0].Title}
                <br />
                <div >{el.setConfig[0].Host} </div>
           <div>{el.setConfig[0].RoomCategory}</div>
                <button type='button' onClick={joinRoom} value={el.RoomId}>
                  join
                </button>
              </div>
            </form>
          )
        })}
      </div>
    )
  } else {
    return <div className='emptyContent'>empty content</div>
  }
}

export default Content
