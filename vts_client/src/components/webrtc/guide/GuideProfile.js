import React from 'react'
import { useNavigate } from 'react-router-dom'

const GuideProfile = () =>
  {
    const navigate = useNavigate()

    // Nav Link로 바꿀 것 
    const redirectGuideLandingPage = ()=>{
      // Guide id would be linked to login system 
      const id  = '1'
      return navigate(`/guide${id}/landing`)
  
    }
      // Nav Link로 바꿀 것 
    const redirectGuideContentsPage = () =>{
      // Guide id would be linked to login system 
      const id  = '1'
      return navigate(`/guide${id}/contents`)
    }
  


    return (
      <div className='guideContents'>
      <div className='navbar'>
          <button onClick={redirectGuideLandingPage}>가이드 방송 시작 페이지 이동</button>
          <button onClick={redirectGuideContentsPage}>가이드 컨텐츠 목록 페이지 이동</button>
      </div>
      <br/>
        <button>내 프로필</button>
      </div>
    )
  }

export default GuideProfile
