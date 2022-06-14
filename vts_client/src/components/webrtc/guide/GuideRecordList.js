import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { GetFetchQuotes } from '../../../api/fetch'

import GuideContents from './GuideContents'

const GuideRecordList = () => {
  const navigate = useNavigate()
  const [liveList, setLiveList] = useState([])
  const sessionToken = sessionStorage.getItem('token')

  const [modal, setModal] = useState(false)

  console.log('session', sessionToken)
  console.log('liveList', liveList)
  useEffect(() => {
    GetFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/recordResources/${sessionToken}`,
      msg: 'GET current Record Contents information',
    }).then((result) => {
      console.log('result', result)
      if (result.status === 200) {
        setLiveList(result.data)
      } else {
        const { status, statusText } = result
        switch (status) {
          case 401:
            // unAuthorized redirect to login page
            alert(`${statusText}, 로그인을 다시 해주세요`)
            return navigate('/login')
          case 400:
            alert(statusText)
            return
          case 500:
            alert(statusText, '관리자에게 문의하십시오')
            return navigate('/errorHandlingPage')
          default:
            return
        }
      }
    })
  }, [])
  const handleGuideContentsModal = () => {
    setModal(!modal)
  }

  // 배열의 길이 말고 다른 방법으로 분기가 가능한지 확인, 더 나은 방법이 있는지

  return (
    <div>
      {liveList.length ?
        <div className='container'>
          {liveList.map((el, idx) => {
            let thumbnail = `${process.env.REACT_APP_LOCAL_IP}/uploads/rec/resources/${el.Thumbnail}`
            console.log('thumbnail', thumbnail)
            console.log(el.Id)
            let brand = JSON.parse(el.RoomBrand)
            console.log('brand', brand)
            return (
              <ul key={idx} >
                <li key={el.Id}>
                  <span>{idx + 1}</span>
                  <span>가이드 이름</span>
                  <img src={thumbnail} alt="thumbnail" width={100} height={50} />
                  <span>{el.Title}</span>
                  <span>{brand[0].name}</span>
                  <span>{el.createdAt.slice(0, el.createdAt.length - 14)}</span>
                </li>
              </ul>
            )
          })
          }
        </div >
        : <div>목록이 비여 있습니다</div>}
      <button onClick={handleGuideContentsModal}>가이드 컨텐츠 등록 모달</button>
      {modal ? <GuideContents handleGuideContentsModal={handleGuideContentsModal} /> : null}
    </div>
  )

};

export default GuideRecordList;