import React, { useState } from 'react'
import { GetFetchQuotes } from '../../../api/fetch'
import { useNavigate } from 'react-router-dom'

import GuideContents from './GuideContents'

import style from './Landing.module.css'

const Landing = (props) => {
  let navigate = useNavigate()
  const sid = sessionStorage.token

  const [modal, setModal] = useState(false)

  // 고유한 방생성을 위한 구분자가 필요해서 사용
  const createRoomNumber = () => {
    GetFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/createRoomNumber/${sid}`,
      msg: 'Get Random room ID',
    }).then((result) => {
      console.log('result', result)
      return navigate(`/stream/${result.data.roomId}`, { replace: true })
    })
  }
  // id 1번을 픽스해 놓고, 테스트 진행중 추후 변경
  const redirectGuideProfilePage = () => {
    const id = '1'
    return navigate(`/guide${id}/profile`)
  }

  const redirectGuideContentsPage = () => {
    const id = '1'
    return navigate(`/guide${id}/contents`)
  }

  const handleRecordList = () => {
    return navigate(`/guide/recordList`)
  }

  const handleGuideContentsModal = () => {
    setModal(!modal)
  }

  return (
    <div className={style.container}>
      <div className={style.live_container}>라이브 관리(Landing component)
        <br />
        <button onClick={createRoomNumber}>라이브 방송(Live Start)</button>
        <button onClick={handleRecordList}>이전방송(가이드 녹화 리스트)</button>
        <button>방송예약</button>
        <br />
        <button>이번방송관리</button>
      </div>
      <div className={style.guide_container}>
        <button onClick={redirectGuideProfilePage}>가이드 프로필 설정 페이지 이동</button>
        {/* <button onClick={handleGuideContentsModal}>가이드 컨텐츠 등록 모달</button> */}
      </div>
      <br />
      {/* {modal ? <GuideContents handleGuideContentsModal={handleGuideContentsModal} /> : null} */}
    </div>
  )
}

export default Landing
