import React, { useEffect, useState, useRef } from 'react'
import { GetFetchQuotes } from '../../../api/fetch'
import { useNavigate } from 'react-router-dom'
import { PostFetchQuotes } from '../../../api/fetch'

import style from './GuideContents.module.css'



const GuideContents = ({ handleGuideContentsModal }) => {
  const [contents, setContents] = useState([])
  const [roomId, setRoomId] = useState('')

  const [roomTitle, setRoomTitle] = useState('')

  const [thumbnail, setThumbnail] = useState({})
  const [media, setMedia] = useState({})

  const [brandConfig, setBrandConfig] = useState([])
  const [brandNameMenu, setBrandNameMenu] = useState([])

  const guideInfo = sessionStorage.getItem('token')

  useEffect(() => {
    GetFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/brandList`,
      msg: 'Get registered brand items',
    }).then(response => {
      console.log('brand', response)
      setBrandNameMenu(response.data)
    }
    )
  }, [])

  console.log('brandConfig', brandConfig)
  const brandSelectionAdd = (e) => {

    const brand = JSON.parse(e.target.value)
    const { id, name } = brand

    if (brandConfig.some(config => config['name'] === name)) {
      return alert('이미 선택하신 브랜드입니다.')
    }

    let addBrandList = [...brandConfig, brand]
    setBrandConfig(addBrandList)
    e.preventDefault()
  }

  const brandDelete = (e) => {
    const brandId = e.target.value

    const brandFilter = brandConfig.filter((el) =>
      Number(el.id) !== Number(brandId)
    )
    setBrandConfig(brandFilter)
    e.preventDefault();
  }

  useEffect(() => {
    GetFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/guideRoomList`,
      msg: 'GET current Room Contents information',
    }).then((result) => {
      console.log('rec list', result)
      setContents(result.data)
    })
  }, [])

  const navigate = useNavigate()

  const redirectGuideLandingPage = () => {
    const id = '1'
    return navigate(`/guide${id}/landing`)

  }
  const redirectGuideProfilePage = () => {
    const id = '1'
    return navigate(`/guide${id}/profile`)
  }


  // 썸네일
  const handleThumbnail = (e) => {
    setThumbnail(e.target.files[0])
    e.preventDefault()

  }
  // media
  const handleMedia = (e) => {
    setMedia(e.target.files[0])
    e.preventDefault()
  }

  console.log('thumbnail', thumbnail)
  console.log('media', media)

  // formData 형식으로 담는다
  const uploadRecordMedia = (event) => {
    let formData = new FormData()
    formData.append('thumbnail', thumbnail)
    formData.append('media', media)
    formData.append('title', roomTitle)
    formData.append('brandConfig', JSON.stringify(brandConfig))

    PostFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/recordMediaUpload/${guideInfo}`,
      body: formData,
      msg: '녹화본 등록'
    }).then((el) => {
      return window.location.replace("/guide/recordList")
    })
    event.preventDefault()
  }

  return (
    <div className={style.container} onClick={handleGuideContentsModal}>
      {/* <div className='navbar'>
        <button onClick={redirectGuideLandingPage}>가이드 방송 시작 페이지 이동</button>
        <button onClick={redirectGuideProfilePage}>가이드 프로필 설정 페이지 이동</button>
        <button onClick={handleRecordList}>가이드 녹화 리스트</button>
      </div> */}
      {/* <br />
      <section>
      Live
    </section> */}
      <br />
      <div className={style.modal_window} onClick={(e) => e.stopPropagation()} >
        Guide Contents Component
        <section className={style.modal_view}>
          Rec
          <br />
          <form onSubmit={uploadRecordMedia}>
            <label>
              Dummy rec thumbnail:{' '}
              <input type='file' name='thumbnail' required multiple onChange={handleThumbnail} />
            </label>
            <br />
            <label>
              rec media :{' '}
              <input type='file' name='media' required multiple onChange={handleMedia} />
            </label>
            <br />

            <label>
              제목:{' '}
              <input
                type='text'
                name='title'
                value={roomTitle}
                onChange={(e) => {
                  setRoomTitle(e.target.value)
                }}
              />
            </label>
            <br />

            <span>브랜드 설정</span>
            {brandConfig.map((brand, idx) => {
              return <div key={brand.id}>{brand.name}<button value={brand.id} onClick={brandDelete}>delete</button></div>
            })}
            <select
              name="brandMenu"
              id="brandMenu"
              // displayEmpty
              onChange={brandSelectionAdd}
            >
              <option value="">선택</option>
              {brandNameMenu.map((items, idx) =>
              (
                <option key={idx} value={JSON.stringify({ id: items.Id, name: items.Name })}>
                  {items.Name}
                </option>
              )
              )}
            </select>
            <br />
            <input type='submit' value='녹화 업로드' />
          </form>
        </section>
      </div >
    </div >
  )
}

export default GuideContents
