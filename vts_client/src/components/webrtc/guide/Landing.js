import React from 'react'
import { GetFetchQuotes } from '../../../api/fetch'
import { useNavigate } from 'react-router-dom'

const Landing = (props) =>
  {
    let navigate = useNavigate()

    const createRoomNumber = () => {
      GetFetchQuotes({

        uri: `${process.env.REACT_APP_LOCAL_IP}/createRoomNumber`,

        msg: 'Get Random room ID',
      }).then((result) => {
        console.log(result)
        return navigate(`/stream/${result.roomId}`, { replace: true })
      })
    }

  const redirectGuideProfilePage = ()=>{
    const id  = '1'
    return navigate(`/guide${id}/profile`)

  }
  const redirectGuideContentsPage = () =>{
    const id  = '1'
    return navigate(`/guide${id}/contents`)
  }

    
    return (
      <div className='landing'>
        <div>Landing component</div>
        <div className='navbar'>
          <button onClick={redirectGuideProfilePage}>가이드 프로필 설정 페이지 이동</button>
          <button onClick={redirectGuideContentsPage}>가이드 컨텐츠 목록 페이지 이동</button>
        </div>
        <br/>
        <button onClick={createRoomNumber}>Live Start</button>
      </div>
    )
  }

export default Landing
