import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { roomAdd, updateLocalMedia } from '../../../redux/thunk'

import { PostFetchQuotes } from '../../../api/fetch'
import DetectRTC from 'detectrtc'

const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/?key=demo2'

const peerInfo = getPeerInfo()
let peerGeo
let myVideoStatus = true
let myAudioStatus = true
let myHandStatus = false
let isRecScreenSream = false
let videoMaxFrameRate = 30

const videoConstraints = getVideoConstraints('default')
const constraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
  video: videoConstraints,
}

/**
 *
 * @returns video constraints
 */
function getVideoConstraints(videoQuality) {
  let frameRate = { max: videoMaxFrameRate }
  switch (videoQuality) {
    case 'default':
      return { frameRate: frameRate }
  }
}

/**
 *
 * @param {socket instance} props
 * @returns SetupBox component
 */
const SetupBox = (props) => {
  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const signalingSocket = props.socket
  const { id } = useParams()
  const roomId = id
  const [thumbnail, setThumbnail] = useState(null)
  const [roomTitle, setRoomTitle] = useState('')
  const [roomHost, setRoomHost] = useState('')
  const [roomCategory, setRoomCategory] = useState('')

  const [roomStorePath, setRoomStorePath] = useState('')
  const [roomStoreCategory, setRoomStoreCategory] = useState('')
  const [roomStoreId, setRoomStoreId] = useState('')
  const [roomProductId, setRoomProductId] = useState('')

  useEffect(() => {
    getPeerGeoLocation()
    // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    //   console.log('Access granted to audio/video')
    //   return dispatch(updateLocalMedia(stream))
    // })
  }, [])

  const onFileChange = (e) => {
    setThumbnail(e.target.files[0])
  }

  // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  //   console.log('Access granted to audio/video')
  //   return dispatch(updateLocalMedia(stream))
  // })
  // return setLocalMediaStream(stream)

  /**
   * Audio & Meida setup done correctly
   * POST room setup data to Server ; aka. DB store
   * & emit to Server ; aka. user list page sync
   */
  const roomCreate = (event) => {
    let formData = new FormData()
    formData.append('thumbnail', thumbnail)
    formData.append('title', roomTitle)
    formData.append('host', roomHost)
    formData.append('roomId', roomId)
    formData.append('roomCategory', roomCategory)

    formData.append('storePath', roomStorePath)
    formData.append('storeCategory', roomStoreCategory)
    formData.append('storeId', roomStoreId)
    formData.append('productId', roomProductId)

    PostFetchQuotes({
      // uri: 'https://dbd6-211-171-1-210.ngrok.io/roomCreate',
      // uri: 'https://106.255.237.50:4000/roomCreate',
      uri: `${process.env.REACT_APP_PUBLIC_IP}/roomCreate`,

      body: formData,
      msg: 'Create Room',
    })
    console.log('room create done')
    console.log('emit join to channel event to server')

    console.log(peerGeo)

    signalingSocket.emit('join', {
      channel: roomId,
      peer_info: peerInfo, // peerInfo
      peer_role: 'host', // host or user
      peer_geo: peerGeo, // peerGeo
      peer_name: roomHost, // myPeerName
      peer_video: myVideoStatus, // myVidoeStatus
      peer_audio: myAudioStatus, // myAudioStatus
      peer_hand: myHandStatus, // myHandStatus
      peer_rec: isRecScreenSream, // isRecScreenStream
    })

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      console.log('Access granted to audio/video')
      return dispatch(updateLocalMedia(stream))
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
            value={roomTitle}
            onChange={(e) => {
              setRoomTitle(e.target.value)
            }}
          />
        </label>
        <br />
        <label>
          Dummy host:{' '}
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
          Dummy Room category:{' '}
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
        <br />

        <label>
          Dummy Store path:{' '}
          <input
            type='text'
            name='storePath'
            value={roomStorePath}
            onChange={(e) => {
              setRoomStorePath(e.target.value)
            }}
          />
        </label>
        <br />
        <label>
          Dummy Store category:{' '}
          <input
            type='text'
            name='storeCategory'
            value={roomStoreCategory}
            onChange={(e) => {
              setRoomStoreCategory(e.target.value)
            }}
          />
        </label>
        <br />
        <label>
          Dummy Store Id:{' '}
          <input
            type='number'
            name='storeId'
            value={roomStoreId}
            onChange={(e) => {
              setRoomStoreId(e.target.value)
            }}
          />
        </label>
        <br />
        <label>
          Dummy Store Product Id:{' '}
          <input
            type='number'
            name='productId'
            value={roomProductId}
            onChange={(e) => {
              setRoomProductId(e.target.value)
            }}
          />
        </label>
        <br />

        <input type='submit' value='setup done' />
      </form>
    </div>
  )
}

export default SetupBox

/**
 * Get peer info using DetecRTC
 * https://github.com/muaz-khan/DetectRTC
 * @returns Obj peer info
 */
function getPeerInfo() {
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

/**
 * Get approximative peer geolocation
 * @returns json
 */
function getPeerGeoLocation() {
  fetch(peerLoockupUrl)
    .then((res) => res.json())
    .then((outJson) => {
      peerGeo = outJson
    })
    .catch((err) => console.error(err))
}
