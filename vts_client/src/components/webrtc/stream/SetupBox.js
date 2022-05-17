import React, { useRef, useState, useEffect } from 'react'
import {  useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { audioUpdate, videoUpdate, createLocalMedia } from '../../../redux/thunk'

import { GetFetchQuotes, PostFetchQuotes } from '../../../api/fetch'
import DetectRTC from 'detectrtc'

import { ToggleButtonGroup, ToggleButton,  MenuItem, FormControl, Select, Button } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'


const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/?key=demo2'
let peerGeo = getPeerGeoLocation()

const SetupBox = () => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const mediaConstraintsState = state.mediaConstraints
  const guideInfo = sessionStorage.getItem('token')
  const navigate = useNavigate()
  const { id } = useParams()
  const roomId = id

  const [brandConfig, setBrandConfig] = useState([])
  const [brandNameMenu, setBrandNameMenu] = useState([])
  const useVideo = useRef(true)
  const useAudio = useRef(true)
  const thumbnail = useRef(null)
  const roomTitle = useRef('')

  const peerInfo = getPeerInfo()
  const isWebRTCSupported = DetectRTC.isWebRTCSupported
  const myBrowserName = DetectRTC.browser.name
  const videoConstraints = myBrowserName ==='Firefox' ? getVideoConstraints('useVideo', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo) : getVideoConstraints('default', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo)
  const constraints = {
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
      video: videoConstraints,
  }

  useEffect(()=>{
    GetFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/brandList`,
      msg: 'Get registered brand items',
    }).then(response => {
      setBrandNameMenu(response)
    }
      )
    },[])



  const audioController = () =>{
    useAudio.current = !mediaConstraintsState.useAudio
    const currentAudioOption = useAudio.current
    dispatch(audioUpdate(currentAudioOption)) // myVideoStatus = true || false && useVideo = constraint 
  }

  const videoController =()=>{
    useVideo.current = !mediaConstraintsState.useVideo
    const currentVideoOption = useVideo.current
    dispatch(videoUpdate(currentVideoOption))
  }

  const onFileChange = (event) => {
    thumbnail.current = event.target.files[0]
  }


  const brandSelectionAdd = (event) =>{
    const {id, name} = event.target.value

    if(brandConfig.some(config => config['name'] === name)){
      return alert('이미 선택하신 브랜드입니다.')
    }
    
    let updatedBrandList = [...brandConfig, {id: id, name:name}]
    setBrandConfig(updatedBrandList)
    event.preventDefault()

  }

  const brandSelectionDelete = (event)=>{
    const removeItem = event.target.value
    setBrandConfig((brandConfig => {
      return brandConfig.filter((item,idx)=>idx != removeItem)
    }))
    event.preventDefault()
  }


  const roomCreate = (event) => {
    let formData = new FormData()
    console.log(guideInfo)
    console.log(brandConfig)
    formData.append('guideInfo', guideInfo)
    formData.append('thumbnail', thumbnail.current)
    formData.append('title', roomTitle.current)
    formData.append('roomId', roomId)
    formData.append('brandConfig', JSON.stringify(brandConfig))

    console.log(formData)

    PostFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/roomCreate`,
      body: formData,
      msg: 'Create Room',
    }).then(
      res => {
        if(!res.status){
          state.signalingSocket.emit('join', {
            channel: roomId,
            peer_name: peerInfo, 
            peer_role: 'host',
            peer_geo: peerGeo, 
            peer_video: mediaConstraintsState.myVideoStatus,
            peer_audio: mediaConstraintsState.myAudioStatus, 
            peer_hand: mediaConstraintsState.myHandStatus, 
            peer_rec: mediaConstraintsState.isRecScreenSream,
      
        })
      
        navigator.mediaDevices.getUserMedia(constraints).then(stream =>{
          console.log('Access granted to audio/video')
          stream.getVideoTracks()[0].enabled = mediaConstraintsState.myVideoStatus 
          stream.getAudioTracks()[0].enabled = mediaConstraintsState.myAudioStatus 
          return dispatch(createLocalMedia(stream))
        })
        }else{
          console.log(res)
           alert('방 생성 실패 code: ' + res.status)
           let guideId  = JSON.parse(guideInfo).token.id
           return navigate(`/guide${guideId}/landing`)
        }
      }
    )


    event.preventDefault()
  }
  
  return (
    <div className='setupBox'>
      <div>방송정보 입력</div>
      <div>{id}</div>
      <form onSubmit={roomCreate}>
        <label>
          방송 사진(썸네일):{' '}
          <input type='file' name='thumbnail' onChange={onFileChange} />
        </label>
        <br />
        <label>
          방송 제목:{' '}
          <input
            type='text'
            name='title'
            ref={roomTitle}
            onChange={(e) => {
              roomTitle.current = (e.target.value)
            }}
          />
        </label>
        <br />
        <br />

        
        {brandConfig.map((brandEl,idx) => {
          return <><div key={idx}>{brandEl.name}<Button variant='outlined' value={idx} onClick={brandSelectionDelete} startIcon={<ClearIcon/>}></Button></div></>
        })}

          <span>브랜드 설정</span>
          <FormControl>
            <Select labelId='brandName' id='brandSelect' value ="" displayEmpty onChange={brandSelectionAdd}>
              <MenuItem value=""><em>선택</em></MenuItem>
              {brandNameMenu.map((items,idx) => {
                return <MenuItem key={idx} value={{id: items.Id, name: items.Name}}>{items.Name}</MenuItem>
              })}
            </Select>
          </FormControl>  
        <br />

        <input type='submit' value='setup done' />
      </form>
      <ToggleButtonGroup onClick={videoController} aria-label='video toggle'>
          {useVideo.current ?           
          (<ToggleButton  value={useVideo} aria-label='video off'>
            video off 
          </ToggleButton>)
           :       
            (<ToggleButton value={useVideo} aria-label='video on'>
            video on 
          </ToggleButton>)}
        </ToggleButtonGroup>

        <ToggleButtonGroup onClick={audioController} aria-label='video toggle'>
          {useAudio.current ?           
          (<ToggleButton value={useAudio} aria-label='audio off'>
            audio off 
          </ToggleButton>)
          : 
         (<ToggleButton value={useAudio} aria-label='audio on'>
          audio on 
        </ToggleButton>)
         }
        </ToggleButtonGroup>
    </div>
  )
}

export default SetupBox



 function getPeerInfo(){
  return {
      detectRTCversion: DetectRTC.version,
      isWebRTCSupported: DetectRTC.isWebRTCSupported,
      isMobileDevice: DetectRTC.isMobileDevice,
      osName: DetectRTC.osName,
      osVersion: DetectRTC.osVersion,
      browserName: DetectRTC.browser.name,
      browserVersion: DetectRTC.browser.version,
    }
}


function getPeerGeoLocation() {
  fetch(peerLoockupUrl)
    .then((res) => res.json())
    .then((outJson) => {
      peerGeo = outJson
    })
    .catch((err) => console.error(err))
}


function getVideoConstraints(vidoeQuality, videoMaxFrameRate, useVideo){
  let frameRate = { max: videoMaxFrameRate }
  switch (vidoeQuality) {
    case 'useVideo':
      return useVideo
    case 'default':
      return { frameRate: frameRate }
    case 'qvgaVideo':
      return {
        width: { exact: 320 },
        height: { exact: 240 },
        frameRate: frameRate,
      } 
    case 'vgaVideo':
      return {
        width: { exact: 640 },
        height: { exact: 480 },
        frameRate: frameRate,
      } 
    case 'hdVideo':
      return {
        width: { exact: 1280 },
        height: { exact: 720 },
        frameRate: frameRate,
      }
    case 'fhdVideo':
      return {
        width: { exact: 1920 },
        height: { exact: 1080 },
        frameRate: frameRate,
      } 
    case '4kVideo':
      return {
        width: { exact: 3840 },
        height: { exact: 2160 },
        frameRate: frameRate,
      } 
  default: 
      return { frameRate: frameRate }
  }
}