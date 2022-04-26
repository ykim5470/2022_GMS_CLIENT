import { io } from 'socket.io-client'

const signalingServerPort = 4000
// const signalingServer = 'https://dbd6-211-171-1-210.ngrok.io'
// const signalingServer = 'https://106.255.237.50:4000'
// const signalingServer = 'https://enjoystreet.kr'
const signalingServer = process.env.REACT_APP_PUBLIC_IP


let signalingSocket = io(signalingServer, {
  // withCredentials: true,
  // extraHeaders: {
  //   'my-custom-header': 'webrtcSocketFromClient',
  // },
})

// init state
const initialState = {
  dummy: 'dummy',
  signalingSocket: signalingSocket,
  roomContents: 0,
  testNum: 1,
  localMediaStream: null,
  mediaConstraints: {
    useVideo: true, 
    useAudio: true, 
    myVideoStatus: true, 
    myAudioStatus: true, 
    myHandStatus: false,
    isRecScreenSream: false, 
    videoMaxFrameRate : 30 
  },
  test: true
}

// reducers
export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'dummy_dispatch':
      console.log(action.payload)
      return { ...state, dummy: action.payload }
    case 'room_add':
      console.log(action.payload)
      return { ...state, roomContents: action.payload }
    case 'test_update':
      return { ...state, testNum: action.payload }
    case 'set_local_media_stream':
      return { ...state, localMediaStream: action.payload }
    case 'update_local_media_stream':
      return {...state, localMediaStream: action.payload}
    case 'update_audio_setting':
      state.mediaConstraints.myAudioStatus = action.payload
      state.mediaConstraints.useAudio  = action.payload
      return {...state}
      case 'update_video_setting':
        state.mediaConstraints.myVideoStatus = action.payload
        state.mediaConstraints.useVideo  = action.payload
        return {...state}
    default:
      return state
  }
}
