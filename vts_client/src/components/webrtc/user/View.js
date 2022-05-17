import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {PostFetchQuotes, GetFetchQuotes} from '../../../api/fetch'
import DetectRTC from 'detectrtc'

import {Button} from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FavoriteIcon from '@mui/icons-material/Favorite'



const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/?key=demo2'

const peerInfo = getPeerInfo()
let peerGeo
let myVideoStatus = false
let myAudioStatus = false
let isRecScreenSream = false


const View = () => {
  const navigate = useNavigate()
  const state = useSelector((state) => state)
  const peerConnection = useRef({})
  const peerConnections = useRef({})
  const videoRef = useRef({})
  const nickName = useRef('')
  const msgerInput = useRef('')
  const [chatMessage,setChatMessage] = useState([])
  const [hostNickName, setHostNickName] = useState('')
  const [hostProfile, setHostProfile] = useState('')
  const [roomTitle, setRoomTitle] = useState('')
  const [roomLikeCountTotal , setRoomLikeCountTotal] = useState(0)
  const [itemTotal, setItemTotal] = useState(0)
  


  const { id } = useParams()
  const roomId = id

  useEffect(() => {
    // Host Info GET aka. nickname, profile
    GetFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/hostInfo/${roomId}`,
      msg: 'Get the host information '
    }).then(response=>{
      console.log(response) 
      setHostNickName(response.nickName)
      // profile should be response.profileImage
      setHostProfile(`${process.env.REACT_APP_LOCAL_IP}/uploads/thumbnail_1652398617785.png`)
    })

    // Room Info GET aka. title, like, 
    GetFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/roomInfo/${roomId}`,
      msg: 'Get the room information '
    }).then(response=>{
      console.log(response)
      setRoomLikeCountTotal(response.likeCountTotal)
      setRoomTitle(response.title)
    })

    // Registered brands aka. product list, ad info 
    GetFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/brandInfo/${roomId}`,
      msg: 'Get the bsrand information '
    }).then(response=>{
      let itemTotal = 0
      for(let brand in response){
        itemTotal += response[brand].length
      }
      setItemTotal(itemTotal)
    })
    

    getPeerGeoLocation()
    state.signalingSocket.emit('join', {
      channel: roomId,
      peer_info: peerInfo,
      peer_role: 'user',
      peer_geo: peerGeo,
      peer_name: 'user1',
      peer_video: myVideoStatus,
      peer_audio: myAudioStatus,
      peer_hand: false,
      peer_rec: isRecScreenSream,
    })

    console.log('접속한 피어 클라이언트 소켓 아이디')
    console.log(state.signalingSocket)
    console.log(state.signalingSocket.id)


    state.signalingSocket.on('addPeer', (config) => {
      const { peer_id, iceServers } = config

      console.log(state.signalingSocket)
      console.log(state.signalingSocket.id)
      console.log('재접속 하나요?')

      peerConnection.current = new RTCPeerConnection({ iceServers: iceServers })

      peerConnections.current = {
        [peer_id]: peerConnection.current,
      }

      peerConnections.current[peer_id].onicecandidate = (event) => {
        if (!event.candidate) return
        state.signalingSocket.emit('relayICE', {
          peer_id: peer_id,
          ice_candidate: {
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
          },
        })
      }

      peerConnections.current[peer_id].ontrack = (event) => {

        videoRef.current.srcObject = event.streams[0]
      }
    })

    state.signalingSocket.on('receiveChat', (data)=>{
      const { msg} = data
      setChatMessage(
        chatMessage => [...chatMessage, msg]
      )
    })

    state.signalingSocket.on('iceCandidate', (config) => {
      const { peer_id, ice_candidate } = config
      peerConnections.current[peer_id]
        .addIceCandidate(new RTCIceCandidate(ice_candidate))
        .catch((err) => {
          console.error('[Error] addIceCandidate', err)
        })
    })

    state.signalingSocket.on('sessionDescription', (config) => {
      const { peer_id, session_description } = config
      let description = new RTCSessionDescription(session_description)

      peerConnections.current[peer_id]
        .setRemoteDescription(description)
        .then(() => {
          if (session_description.type === 'offer') {
            peerConnections.current[peer_id]
              .createAnswer()
              .then((local_description) => {
                peerConnections.current[peer_id]
                  .setLocalDescription(local_description)
                  .then(() => {
                    {
                      state.signalingSocket.emit('relaySDP', {
                        peer_id: peer_id,
                        session_description: local_description,
                      })
                      console.log('Answer setLocalDescription done!')
                      return
                    }
                  })
                  .catch((err) => {
                    console.error('[Error] answer setLocalDescription', err)
                  })
              })
              .catch((err) => {
                console.error('[Error] creating answer', err)
              })
          }
        })
        .catch((err) => {
          console.error('[Error] setRemoteDescription', err)
        })
    })


    state.signalingSocket.on('removePeer', (config) =>{
      const {peer_id} = config
      console.log('-------1')
      console.log(peer_id)
      console.log('-------2')

      console.log(config)
      console.log('-------3')

      console.log(peerConnections.current)
      // 
      if(peer_id in peerConnections.current) peerConnections.current[peer_id].close()
      
      delete peerConnections.current[peer_id]

      console.log(peerConnections.current)
      navigate('/user', {replace: true}) 
    })
  }, [])



  const addFavorite = async()  => {
  
    await PostFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/addLike`,
      body: {
        RoomId: roomId, 
        UserSocketId: state.signalingSocket.id, 
        action: true
      },
      msg: 'Add like to the channel'
    })
  
    state.signalingSocket.emit('likeAdd', {
      roomId: roomId, 
      currentLikeCount : roomLikeCountTotal
    })
    state.signalingSocket.on('addedLikeCount', data => {
      console.log(data)
      setRoomLikeCountTotal(data)
    }
    )
   }

useEffect(()=>{
      // Room Info GET aka. title, like, 
      GetFetchQuotes({
        uri: `${process.env.REACT_APP_LOCAL_IP}/roomInfo/${roomId}`,
        msg: 'Get the room information '
      }).then(response=>{
        console.log(response)
        setRoomLikeCountTotal(response.likeCountTotal)
        setRoomTitle(response.title)
      })
}, [roomLikeCountTotal])



 const sendChatMessage = async() => {
  const msg = msgerInput


  await PostFetchQuotes({
    uri: `${process.env.REACT_APP_LOCAL_IP}/createChatLog`,
    body: {
      RoomId: roomId, 
      User: state.signalingSocket.id, 
      Text: msgerInput.current
    },
    msg: 'Create Chat Data Log'
  })
  

  state.signalingSocket.emit('chatting', (
    {
      channel: roomId,
      peer_id: state.signalingSocket.id, 
      msg: msgerInput.current}
  ))

  setChatMessage(
    chatMessage => [...chatMessage, msg.current]
  )
}


  return (
    <div className='user'>
      ENJOYSTREET
      <br/>
      <img width={30} height={30} alt='host profile image' src={hostProfile} />
      <span className='hostNickName'>{hostNickName}</span>
      <br/>
      <div className='likeCountTotal'> 
        {roomLikeCountTotal}
      </div>
      <video ref={videoRef} autoPlay playsInline muted />
      <div className='wrapper'>
        <div className='display-container'>
          <ul className='chatting-list'>
              {chatMessage.map((msgObj,idx) => {return <li key={idx}>{msgObj}</li>})}
          </ul>
        </div>
        <div className='user-container'>
          <label htmlFor='nickName'>이름 :</label>
          <input type='text' ref={nickName}/>
        </div>
        <div className='input-container'/>
          <span>
            <input type='text' className='chatting-input' ref={msgerInput} onChange={(e)=>{msgerInput.current = e.target.value}}/>
            <button className='send-button' onClick={sendChatMessage}>전송</button>
          </span>
      </div>
      <span className='shop-container'>
        <Button startIcon={<FormatListBulletedIcon/>}>{itemTotal}</Button>
      </span>
      <span className='favorite-btn'>
      <Button onClick={addFavorite} startIcon={<FavoriteIcon/>}></Button>
      </span>
    </div>
  )
}

export default View


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

function getPeerGeoLocation() {
  fetch(peerLoockupUrl)
    .then((res) => res.json())
    .then((outJson) => {
      peerGeo = outJson
    })
    .catch((err) => console.error(err))
}




