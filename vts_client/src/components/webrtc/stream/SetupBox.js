import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { audioUpdate, videoUpdate, createLocalMedia } from '../../../redux/thunk'

import { PostFetchQuotes } from '../../../api/fetch'
import DetectRTC from 'detectrtc'

import { ToggleButtonGroup, ToggleButton } from '@mui/material'


const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/?key=demo2'
let peerGeo = getPeerGeoLocation()



const SetupBox = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const mediaConstraintsState = state.mediaConstraints

  const { id } = useParams()
  const roomId = id

  const useVideo = useRef(true)
  const useAudio = useRef(true)

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

  const thumbnail = useRef(null)
  const roomTitle = useRef('')
  const roomHost = useRef('')
  const roomCategory= useRef('')

  const roomStorePath = useRef('')
  const roomStoreCategory = useRef('')
  const roomStoreId = useRef('')
  const roomProductId = useRef('')

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


  const onFileChange = (e) => {
    thumbnail.current = e.target.files[0]
  }


  const roomCreate = (event) => {
    let formData = new FormData()
    formData.append('thumbnail', thumbnail.current)
    formData.append('title', roomTitle.current)
    formData.append('host', roomHost.current)
    formData.append('roomId', roomId)
    formData.append('roomCategory', roomCategory.current)

    formData.append('storePath', roomStorePath.current)
    formData.append('storeCategory', 'dummy')
    formData.append('storeId', 1)
    formData.append('productId', roomProductId.current)

    console.log(formData)

    PostFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/roomCreate`,
      body: formData,
      msg: 'Create Room',
    })


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

    event.preventDefault()
  }
  
  return (
    <div className='setupBox'>
      <div>setupBox component</div>
      <div>{id}</div>
      <form onSubmit={roomCreate}>
        <label>
          Dummy thumbnail:{' '}
          <input type='file' name='thumbnail' onChange={onFileChange} />
        </label>
        <br />
        <label>
          Dummy title:{' '}
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
        <label>
          Dummy host:{' '}
          <input
            type='text'
            name='host'
            ref = {roomHost}
            onChange={(e) => {
              roomHost.current =(e.target.value)
            }}
          />
        </label>
        <br />
        <label>
          Dummy Room category:{' '}
          <input
            type='text'
            name='roomCategory'
            ref={roomCategory}
            onChange={(e) => {
              roomCategory.current = (e.target.value)
            }}
          />
        </label>
        <br />
        <br />

        <label>
          Dummy Store path:{' '}
          <input
            type='text'
            name='storePath'
            ref={roomStorePath}
            onChange={(e) => {
              roomStorePath.current = (e.target.value)
            }}
          />
        </label>
        <br />
        <label>
          Dummy Store category:{' '}
          <input
            type='text'
            name='storeCategory'
            ref={roomStoreCategory}
            onChange={(e) => {
              roomStoreCategory.current = (e.target.value)
            }}
          />
        </label>
        <br />
        <label>
          Dummy Store Id:{' '}
          <input
            type='number'
            name='storeId'
            ref={roomStoreId}
            onChange={(e) => {
              roomStoreId.current = (e.target.value)
            }}
          />
        </label>
        <br />
        <label>
          Dummy Store Product Id:{' '}
          <input
            type='number'
            name='productId'
            ref={roomProductId}
            onChange={(e) => {
              roomProductId.current = (e.target.value)
            }}
          />
        </label>
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
         (<ToggleButton value={useVideo} aria-label='audio on'>
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