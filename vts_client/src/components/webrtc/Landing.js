import React, { useState, useEffect } from 'react'
import { GetFetchQuotes } from '../../api/fetch'
import { useNavigate } from 'react-router-dom'

const Landing = () =>
  // { match, location, history }
  {
    let navigate = useNavigate()
    // let location = useLocation()
    // console.log(search)

    const createRoomNumber = () => {
      GetFetchQuotes({
        uri: 'https://106.255.237.50:4000/createRoomNumber',
        msg: 'Get Random room ID',
      }).then((result) => {
        console.log(result)
        return navigate(`/stream/${result.roomId}`, { replace: true })
      })
    }

    return (
      <div className='landing'>
        <div>Landing component</div>
        {/* <div>{JSON.stringify(match, null, 2)}</div>
      <div>{JSON.stringify(location, null, 2)}</div>~
      <div>{JSON.stringify(history, null, 2)}</div> */}

        <button onClick={createRoomNumber}>Live Start</button>
      </div>
    )
  }

export default Landing
