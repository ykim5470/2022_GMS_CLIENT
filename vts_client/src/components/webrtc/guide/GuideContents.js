import React, {useEffect,useState,useRef} from 'react'
import { GetFetchQuotes } from '../../../api/fetch'
import { useNavigate } from 'react-router-dom'
import { PostFetchQuotes } from '../../../api/fetch'



const GuideContents = () =>
  {
  const [contents, setContents] = useState([])
  const [roomId, setRoomId] = useState('')
  // const [thumbnail, setThumbnail] = useState(null)
  // const [media, setMedia] = useState(null)
  const resources = useRef({})
  const [roomTitle, setRoomTitle] = useState('')
  const [roomHost, setRoomHost] = useState('')
  const [roomCategory, setRoomCategory] = useState('')

    useEffect(()=>{
      GetFetchQuotes({
        // uri: 'https://106.255.237.50:4000/guideRoomList',
        uri: `${process.env.REACT_APP_LOCAL_IP}/guideRoomList`,
        msg: 'GET current Room Contents information',
      }).then((result) => {
        setContents(result)
      })
    },[])

    const navigate = useNavigate()

    // Nav Link로 바꿀 것 
    const redirectGuideLandingPage = ()=>{
      // Guide id would be linked to login system 
      const id  = '1'
      return navigate(`/guide${id}/landing`)
  
    }
      // Nav Link로 바꿀 것 
    const redirectGuideProfilePage = () =>{
      // Guide id would be linked to login system 
      const id  = '1'
      return navigate(`/guide${id}/profile`)
    }


    // const onThumbnailFileChange = (e) => {
    //   setThumbnail(e.target.files[0])
    // }



    // const onMediaFileChange = (e) => {
    //   setMedia(e.target.files[0])

    // }


    const onUploadChange = (e) =>{
      // console.log(e.target.files)
      let fileLists = e.target.files
      resources.current = fileLists
      // console.log(resources.current)
      console.log(resources)
      console.log(resources.current[0])
      console.log(resources.current[1])
      
      e.preventDefault()
      
      // setResources(e.target.files[0])
    }

    // 
    const uploadRecordMedia = (event) =>{
      let formData = new FormData()
      formData.append('roomId', roomId)
      console.log(formData)
      console.log(resources.current)
      for(let i=0; i< resources.current.length; i++){
        formData.append('resources',resources.current[i])
      }
      formData.append('title', roomTitle)
      formData.append('host', roomHost)
      formData.append('roomCategory', roomCategory)

      console.log(formData)

      PostFetchQuotes({
        // uri: 'https://dbd6-211-171-1-210.ngrok.io/roomCreate',
        // uri: 'https://106.255.237.50:4000/recordMediaUpload',
        uri: `${process.env.REACT_APP_LOCAL_IP}/recordMediaUpload`,

        body: formData,
        msg: 'record media upload',
      })
      console.log('record media upload done')

      event.preventDefault()
    }
    

    return (
      <div className='guideContents'>
        Guide Contents Component
              <div className='navbar'>
          <button onClick={redirectGuideLandingPage}>가이드 방송 시작 페이지 이동</button>
          <button onClick={redirectGuideProfilePage}>가이드 프로필 설정 페이지 이동</button>
      </div>
      <br/>
      <section>
        Live
        <br/>
        { contents.map((el,idx) => {
          // let thumnail = `https://106.255.237.50:4000/uploads/${el.setConfig[0].Thumbnail}`
          let thumnail = `${process.env.REACT_APP_LOCAL_IP}/uploads/${el.setConfig[0].Thumbnail}`


          return (<>
          <img width={100} height={50}alt='thumbnail' src={thumnail} />
           <div >{el.setConfig[0].Title} </div>
           <div >{el.setConfig[0].Host} </div>
           <div>{el.setConfig[0].RoomCategory}</div>
          <br/>
           </>
          )
          }) }
      </section>
      <br/>
      <section>
        Rec
        <br/>
        <form onSubmit={uploadRecordMedia}>
          <label>
            Dummy live room id:{' '}
            <input
              type='text'
              name='roomId'
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value)
              }}
            />
          </label>
          <br />
          <label>
            Dummy rec thumbnail & rec media :{' '}
            <input type='file' name='resources' required multiple onChange={onUploadChange} />
          </label>
          <br />
          {/* <label>
            Dummy rec file:{' '}
            <input type='file' name='media' required multiple onChange={onMediaFileChange} />
          </label>
          <br /> */}
          <label>
            Dummy rec title:{' '}
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
          <label>
            Dummy rec host:{' '}
            <input
              type='text'
              name='host'
              value={roomHost}
              onChange={(e) => {
                setRoomHost(e.target.value)
              }}
            />
          </label>
          <br />
          <label>
            Dummy rec Room category:{' '}
            <input
              type='text'
              name='roomCategory'
              value={roomCategory}
              onChange={(e) => {
                setRoomCategory(e.target.value)
              }}
            />
          </label>
          <br />


          <input type='submit' value='녹화 업로드' />
        </form>
      </section>
        
      </div>
    )
  }

export default GuideContents
