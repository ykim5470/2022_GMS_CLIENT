import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useReactMediaRecorder } from 'react-media-recorder'


import { audioUpdate, videoUpdate, audioConstraintUpdate, videoConstraintUpdate, updateLocalMedia, recStateUpdate, mediaRecorderUpdate, recScreenStreamUpdate } from '../../../redux/thunk'

import { PostFetchQuotes } from '../../../api/fetch'
import DetectRTC, { isGetUserMediaSupported } from 'detectrtc'

import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import { Co2Sharp, CollectionsOutlined } from '@mui/icons-material'
// import { style } from '@mui/system'

import style from './Media.module.css'


const Media = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const mediaConstraintsState = state.mediaConstraints
  const signalingSocket = props.socket
  const peerConnections = useRef({})
  const peerConnection = useRef({})
  const description = useRef({})
  const nickName = useRef('')
  const msgerInput = useRef('')
  const [chatMessage, setChatMessage] = useState([])
  const [selfChatMessage, setSelfChatMessage] = useState([])
  const cameraMode = useRef('user')
  const { id } = useParams()
  const roomId = id


  const videoRef = useRef({})
  const [recElapsedTime, setRecElapsedTime] = useState('')
  const mediaRecorderRef = useRef(null)
  const recordedBlobs = useRef([])
  const [recordedBlobsDownload, setRecordedBlobsDownload] = useState(false)
  const urlRef = useRef('')
  const fileRef = useRef('')

  const scrollRef = useRef();

  const naviagte = useNavigate()

  console.log('peerConnections', peerConnections)
  console.log('peerConnection', peerConnection)

  useEffect(() => {

    console.log('접속한 호스트 클라이언트 소켓 아이디')
    console.log(state.signalingSocket.id)
    console.log(state.signalingSocket)

    console.log(state.localMediaStream)

    // state.localMediaStream를 받아서 videoRef에 src로 설정 
    // state.localMediaStream는 미디어 객체인데, setupBox에서 가져온 것이다
    videoRef.current.srcObject = state.localMediaStream

    signalingSocket.on('addPeer', (config) => {
      console.log('config', config) // user 접속시 호출 / 즉, 유저 연결에 대한 소켓인거 같다
      const { peer_id, should_create_offer, iceServers } = config
      // RTCPeerConnection 연결을 유지하고 연결 상태를 모니터링 ?
      // peerConnections의 peer_id에 peerConnection(RTCPeerConnection)를 넣어 준다
      peerConnection.current = new RTCPeerConnection({ iceServers: iceServers })
      peerConnections.current = {
        [peer_id]: peerConnection.current,
      }

      // onicecandidate
      // ICE는 STUN과 TURN 서버를 사용하여 브라우저간 연결을 위한 프레임워크다
      peerConnections.current[peer_id].onicecandidate = (event) => {
        if (!event.candidate) return
        signalingSocket.emit('relayICE', {
          peer_id: peer_id,
          ice_candidate: {
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
          },
        })
      }

      //getTracks, addTrack 미디어 정보를 담는 과정, 그림의 첫번째의 3번
      state.localMediaStream.getTracks().forEach((track) => {
        peerConnections.current[peer_id].addTrack(track, state.localMediaStream)
      })

      // 유저가 들어 왔을때 실행 ?
      // onnegotiationneeded
      if (should_create_offer) {
        peerConnections.current[peer_id].onnegotiationneeded = () => {
          peerConnections.current[peer_id]
            .createOffer() // SDP 생성
            // SDP는 resolution, formats, codecs, encryption 등과 같이 온라인 multimedia content를 
            // 기술하기 위한 표준으로서, media content 자체가 아니라 
            // 장치간 media를 공유하는 연결(connection)에 대한 metadata format이다
            .then((local_description) => {
              peerConnections.current[peer_id]
                .setLocalDescription(local_description) // 연결이 이미 되어있는데 setLocalDescription()가 호출된다면, 이는 재협상이 진행 중?
                .then(() => {
                  signalingSocket.emit('relaySDP', {
                    peer_id: peer_id,
                    session_description: local_description,
                  })
                })
                .catch((err) => {
                  console.error('[Error] offer setLocalDescription', err)
                })
            })
            .catch((err) => {
              console.error('[Error] sending offer', err)
            })
        }
      }
    })

    signalingSocket.on('receiveChat', (data) => {
      const { msg, nick } = data
      console.log('nick', nick)
      setChatMessage(
        chatMessage => [...chatMessage, { msg, nick }]
      )
      // setChatMessage(
      //   chatMessage => [...chatMessage, `${nick}: ${msg}`]
      // )
    })


    signalingSocket.on('iceCandidate', (config) => {
      const { peer_id, ice_candidate } = config
      peerConnections.current[peer_id]
        .addIceCandidate(new RTCIceCandidate(ice_candidate)) // addIceCandidate "candidate 종료"를 알려준다 ?
        .catch((err) => {
          console.error('[Error] addIceCandidate', err)
        })
    })

    signalingSocket.on('sessionDescription', (config) => {
      const { peer_id, session_description } = config


      description.current = new RTCSessionDescription(session_description)

      peerConnections.current[peer_id]
        .setRemoteDescription(description.current)
        .then(() => {
          console.log('setRemoteDescription done!')
        })
        .catch((err) => {
          console.error('[Error] setRemoteDescription', err)
        })
    })


    signalingSocket.on('removePeer', (config) => {
      const { peer_id, peer_role } = config
      console.log(peer_id)
      console.log(config)
      if (peer_id in peerConnections.current) peerConnections.current[peer_id].close()

      delete peerConnections.current[peer_id]

      console.log(peer_id + ': 해당 유저가 접속을 종료했습니다.')
      console.log('현재 방에 접속한 유저는 다음과 같습니다.')
      console.log(peerConnections.current)
    })
  }, [])


  const chattingScroll = () => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }

  async function sendChatMessage() {
    const msg = msgerInput

    await PostFetchQuotes({
      uri: `${process.env.REACT_APP_LOCAL_IP}/createChatLog`,
      body: {
        RoomId: roomId,
        User: signalingSocket.id,
        Text: msgerInput.current
      },
      msg: 'Create Chat Data Log'
    })

    signalingSocket.emit('chatting', (
      {
        channel: roomId,
        peer_id: signalingSocket.id,
        msg: msgerInput.current,
        nick: nickName.current,
      }
    ))

    // setSelfChatMessage(
    //   selfChatMessage => [...selfChatMessage, { nick: nickName.current, msg: msg.current }]
    // )
    setChatMessage(
      chatMessage => [...chatMessage, { msg: msg.current, nick: nickName.current }]
    )
    chattingScroll()
  }

  useEffect(() => {
    chattingScroll()
  }, [chatMessage])



  const myBrowserName = DetectRTC.browser.name
  const videoConstraints = myBrowserName === 'Firefox' ? getVideoConstraints('default', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo) : getVideoConstraints('useVideo', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo)


  const constraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
    video: videoConstraints,
  }


  const thereisPeerConnections = () => {
    if (Object.keys(peerConnections.current).length === 0) return false
    return true
  }


  const stopLocalVideoTrack = () => {
    return state.localMediaStream.getVideoTracks()[0].stop()
  }

  const swapCamera = () => {
    cameraMode.current = cameraMode.current == 'user' ? 'environment' : 'user'
    console.log('cameraMode', cameraMode)
    dispatch(videoConstraintUpdate({ facingMode: { exact: cameraMode.current } })) // pass camera mode config to constraint 

    console.log(mediaConstraintsState.useVideo) // 이게 facing으로 바뀌어야 지 처음에는 true였겠지만 

    if (mediaConstraintsState.useVideo) stopLocalVideoTrack()

    console.log(constraints.video) // true 나옴. true가 아니라 facingMode로 바뀌어야 하는 걸로 아는데?
    console.log(videoConstraints) // 애가 true 아니면 useVideo인 facing으로 변해야 한다.

    let swapVideoConstraints = myBrowserName === 'Firefox' ? getVideoConstraints('default', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo) : getVideoConstraints('useVideo', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo)
    console.log(swapVideoConstraints) // 바뀐 변수를 다시 넣으니까 적용이 되나?
    const swapConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
      video: swapVideoConstraints,
    }
    console.log(swapConstraints.video) // 새로운 변수인 이건? 여전히 true이다. 

    navigator.mediaDevices.getUserMedia(swapConstraints)
      .then((camStream) => {
        refreshMyStreamToPeers(camStream)
        refreshMyLocalStream(camStream)
        // if (mediaConstraintsState.useVideo) setMyVideoStatusTrue()
      }).catch((err) => {
        console.log('[Error] to swapping camera', err)
      })
  }
  // video on/off => 가이드와 유저와 연결이 안끊어지지않고 설정을 바꿔준다
  const refreshMyStreamToPeers = (stream, localAudioTrackChange = false) => {
    if (!thereisPeerConnections()) return

    for (let peer_id in peerConnections.current) {
      let videoSender = peerConnections.current[peer_id].getSenders().find((s) => (s.track ? s.track.kind === 'video' : false))
      videoSender.replaceTrack(stream.getVideoTracks()[0])
    }
  }


  const refreshMyLocalStream = (stream, localAudioTrackChange = false) => {
    stream.getVideoTracks()[0].enabled = true
    dispatch(updateLocalMedia(stream))
    return videoRef.current.srcObject = stream
  }


  const audioController = () => {
    const currentAudioOption = !mediaConstraintsState.myAudioStatus
    console.log('currentAudioOption', currentAudioOption)
    dispatch(audioUpdate(currentAudioOption))
    state.localMediaStream.getAudioTracks()[0].enabled = currentAudioOption
  }

  const videoController = () => {
    const currentVideoOption = !mediaConstraintsState.myVideoStatus
    dispatch(videoUpdate(currentVideoOption))
    state.localMediaStream.getVideoTracks()[0].enabled = currentVideoOption
  }

  const getTimeToString = (time) => {
    let diffInHrs = time / 3600000
    let hh = Math.floor(diffInHrs)
    let diffInMin = (diffInHrs - hh) * 60
    let mm = Math.floor(diffInMin)
    let diffInSec = (diffInMin - mm) * 60
    let ss = Math.floor(diffInSec)
    let formattedHH = hh.toString().padStart(2, '0')
    let formattedMM = mm.toString().padStart(2, '0')
    let formattedSS = ss.toString().padStart(2, '0')
    return `${formattedHH}:${formattedMM}:${formattedSS}`
  }
  // 녹화
  function handleMediaRecorder(mediaRecorder) {
    mediaRecorder.start()
    mediaRecorder.addEventListener('dataavailable', handleMediaRecorderData)
    mediaRecorder.addEventListener('stop', handleMediaRecorderStop)
    console.log('녹화 핸들러 시작은 되나?')
    console.log(mediaRecorder)
    console.log(mediaRecorder.data)
  }
  // 녹화 데이터
  function handleMediaRecorderData(event) {
    console.log('MediaRecorder data: ', event)
    if (event.data && event.data.size > 0) recordedBlobs.current.push(event.data)
    console.log(recordedBlobs.current)
  }
  // 녹화 stop
  function handleMediaRecorderStop(event) {
    console.log('MediaRecorder stopped: ', event)
    console.log('MediaRecorder Blobs: ', recordedBlobs.current)
    downloadRecordedStream()

  }
  // 녹화 후 다운로드
  function downloadRecordedStream() {
    try {
      const type = recordedBlobs.current[0].type.includes('mp4') ? 'mp4' : 'webm'
      const blob = new Blob(recordedBlobs.current, { type: 'vide/' + type })
      console.log(blob)
      const recFileName = getDataTimeString() + '-REC.' + type
      const currentDevice = DetectRTC.isMobileDevice ? 'Mobile' : 'PC'
      const blobFileSize = bytesToSize(blob.size)

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = recFileName
      // document.body.appenndChild(a)
      a.click()
      recordedBlobs.current = []
      setTimeout(() => {
        // document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)

    }
    catch (err) {
      console.error('download error')
      return
    }
  }


  // 녹화 컨트롤
  const recController = () => {
    const currentRecState = !mediaConstraintsState.isRecScreenSream
    console.log('currentRecState', currentRecState)
    dispatch(recStateUpdate(currentRecState))
    console.log(typeof (currentRecState))
    // 녹화 시작
    if (currentRecState) {
      // Start recording time printing
      let recStartTime = Date.now() // 현재 시간
      let rc = setInterval(function printTime() {
        if (mediaConstraintsState.isRecScreenSream) {
          // 녹화 진행 시간 업데이트
          setRecElapsedTime(getTimeToString(Date.now() - recStartTime))
          return
        }
        clearInterval(rc)
      }, 1000)

      // Start recording
      let options = getSupportedMimeTypes()
      console.log('MediaRecorder options supported', options)
      options = { mimeType: options[0] } // First available as mimeType 
      try {
        if (DetectRTC.isMobileDevice) {
          // mediaRecorder instance 
          // on mobile devices recording camera + audio
          // dispatch(mediaRecorderUpdate(new MediaRecorder(state.localMediaStream, options)))
          // state.mediaRecorder = new MediaRecorder(state.localMediaStream, options)
          console.log(mediaRecorderRef.current)
          mediaRecorderRef.current = new MediaRecorder(state.localMediaStream, options) // insert mediaRecorer to the value of ref 
          console.log(mediaRecorderRef.current)
          handleMediaRecorder(mediaRecorderRef.current)
        } else {
          // on desktop devices recording screen + audio 
          const constraints = {
            video: { framRate: { max: mediaConstraintsState.videoMaxFrameRate } }
          }
          let recScreenStreamPromise = navigator.mediaDevices.getDisplayMedia(constraints)
          recScreenStreamPromise.then(() => {
            const newStream = new MediaStream([
              state.localMediaStream.getVideoTracks()[0],
              state.localMediaStream.getAudioTracks()[0]
            ])
            // dispatch(recScreenStreamUpdate(newStream))
            // dispatch(mediaRecorderUpdate(new MediaRecorder(state.localMediaStream, options)))
            mediaRecorderRef.current = new MediaRecorder(newStream, options)
            // state.mediaRecorder = new MediaRecorder(newStream, options)
            // console.log(state.mediaRecorder)
            console.log(mediaRecorderRef.current)
            console.log('Created MediaRecorder', mediaRecorderRef, 'with options', options)
            handleMediaRecorder(mediaRecorderRef.current)
          }
          )
            .catch(err => {
              console.error('[Error] Unable to recordinng the screen + audio', err)
            })
        }

      } catch (err) {
        console.error('Exception while creating MediaRecorder:', err)
        return
      }

    }
    // 녹화 종료
    else {
      console.log('녹화 종료')
      console.log('mediaRecorder에 stop event call')
      // state.mediaRecorder.stop()
      mediaRecorderRef.current.stop()
    }
  }

  console.log('chatMessage', chatMessage)
  console.log('selfChatMessage', selfChatMessage)

  return (
    <div
      className='media'
      className={style.container}
    >
      {mediaConstraintsState.isRecScreenSream ? <div className='rec-elapsed-time'>REC : {recElapsedTime}</div> : <div>녹화 실행 아님</div>}
      <video className={style.myVideo} ref={videoRef} autoPlay playsInline muted />
      <div className='wrapper'>
        <div
          // className='display-container' 
          className={style.chatting_list}>
          <ul
            ref={scrollRef}
          // className='chatting-list'
          >
            {chatMessage.map((el, idx) => {
              return (
                nickName.current === el.nick ?
                  <li className={style.my_message} key={idx}>
                    <h3>{el.nick}</h3>
                    <span>{el.msg}</span>
                  </li> :
                  <li className={style.your_message} key={idx}>
                    <h3>{el.nick}</h3>
                    <div >{el.msg}</div>
                  </li>
              )
            })}
            {/* {chatMessage.map((msgObj, idx) => { return <li key={idx}>{msgObj}</li> })} */}
          </ul>
        </div>
        <div className='user-container'>
          <label htmlFor='nickName'>名前 :</label>
          <input type='text' ref={nickName} onChange={(e) => { nickName.current = e.target.value }} />
        </div>
        <div className='input-container' />
        <span>
          <input type='text' className='chatting-input' ref={msgerInput} onChange={(e) => { msgerInput.current = e.target.value }} />
          <button className='send-button' onClick={sendChatMessage}>送信</button>
        </span>
      </div>
      <div className='swap-camera'>
        <button className='swapCameraBtn' onClick={swapCamera}>
          카메라 전환
        </button>
      </div>
      <ToggleButtonGroup onClick={videoController} aria-label='video toggle'>
        {mediaConstraintsState.myVideoStatus ?
          (<ToggleButton value={mediaConstraintsState.myVideoStatus} aria-label='video off'>
            video off
          </ToggleButton>)
          :
          (<ToggleButton value={mediaConstraintsState.myVideoStatus} aria-label='video on'>
            video on
          </ToggleButton>)}
      </ToggleButtonGroup>

      <ToggleButtonGroup onClick={audioController} aria-label='video toggle'>
        {mediaConstraintsState.myAudioStatus ?
          (<ToggleButton value={mediaConstraintsState.myAudioStatus} aria-label='audio off'>
            audio off
          </ToggleButton>)
          :
          (<ToggleButton value={mediaConstraintsState.myAudioStatus} aria-label='audio on'>
            audio on
          </ToggleButton>)
        }
      </ToggleButtonGroup>
      <ToggleButtonGroup onClick={recController} aria-label='record toggle'>
        {!mediaConstraintsState.isRecScreenSream ? (
          <ToggleButton value={mediaConstraintsState.isRecScreenSream}>
            Rec Start
          </ToggleButton>
        ) : (
          <ToggleButton value={mediaConstraintsState.isRecScreenSream}>
            Rec Stop
          </ToggleButton>
        )}
      </ToggleButtonGroup>
      <ToggleButtonGroup>
        <ToggleButton>설정</ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}










export default Media


/**
* https://webrtc.github.io/samples/src/content/getusermedia/resolution/
*/
function getVideoConstraints(vidoeQuality, videoMaxFrameRate, useVideo) {
  let frameRate = { max: videoMaxFrameRate }
  switch (vidoeQuality) {
    case 'useVideo':
      return useVideo

    case 'default':
      // Firefox not support set frameRate (OverconstrainedError) O.o
      return { frameRate: frameRate }
    // video cam constraints default
    case 'qvgaVideo':
      return {
        width: { exact: 320 },
        height: { exact: 240 },
        frameRate: frameRate,
      } // video cam constraints low bandwidth
    case 'vgaVideo':
      return {
        width: { exact: 640 },
        height: { exact: 480 },
        frameRate: frameRate,
      } // video cam constraints medium bandwidth
    case 'hdVideo':
      return {
        width: { exact: 1280 },
        height: { exact: 720 },
        frameRate: frameRate,
      } // video cam constraints high bandwidth
    case 'fhdVideo':
      return {
        width: { exact: 1920 },
        height: { exact: 1080 },
        frameRate: frameRate,
      } // video cam constraints very high bandwidth
    case '4kVideo':
      return {
        width: { exact: 3840 },
        height: { exact: 2160 },
        frameRate: frameRate,
      } // video cam constraints ultra high bandwidth
    default:
      return
  }
}

function getSupportedMimeTypes() {
  const possibleTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/mp4;codecs=h264,aac',
    'video/mp4',
  ]
  return possibleTypes.filter((mimeType) => {
    return MediaRecorder.isTypeSupported(mimeType)
  })
}


function getDataTimeString() {
  const d = new Date()
  const date = d.toISOString().split('T')[0]
  const time = d.toTimeString().split(' ')[0]
  return `${date}-${time}`
}

function bytesToSize(bytes) {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}