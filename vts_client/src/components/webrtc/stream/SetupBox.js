import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { roomAdd, testUpdate } from '../../../redux/thunk'

import { PostFetchQuotes } from '../../../api/fetch'
import DetectRTC from 'detectrtc'

const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/?key=demo2'

const peerInfo = getPeerInfo()
let peerGeo
let myVideoStatus = true
let myAudioStatus = true
let myHandStatus = false
let isRecScreenSream = false

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
  const [thumbNail, setThumbNail] = useState(null)
  const [roomTitle, setRoomTitle] = useState('')
  const [roomHost, setRoomHost] = useState('')

  useEffect(() => {
    getPeerGeoLocation()
  }, [])

  const onFileChange = (e) => {
    setThumbNail(e.target.files[0])
  }

  /**
   * Audio & Meida setup done correctly
   * POST room setup data to Server ; aka. DB store
   * & emit to Server ; aka. user list page sync
   */
  const roomCreate = (event) => {
    let formData = new FormData()
    formData.append('thumbNail', thumbNail)
    formData.append('title', roomTitle)
    formData.append('host', roomHost)
    formData.append('roomId', roomId)

    PostFetchQuotes({
      uri: 'http://88d1-211-171-1-210.ngrok.io/roomCreate',
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
    dispatch(roomAdd())

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
