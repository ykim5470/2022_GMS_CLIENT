import { io } from 'socket.io-client'


const signalingServer = process.env.REACT_APP_LOCAL_IP



let signalingSocket = io(signalingServer, {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'webrtcSocketFromClient',
  },
})

const initialState = {
  dummy: 'dummy',
  signalingSocket: signalingSocket,
  roomContents: 0,
  testNum: 1,
  localMediaStream: null,
  user: null,
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


export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'user_authenticated':
      return {...state, user: action.payload}
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
    case 'update_audio_status':
      state.mediaConstraints.myAudioStatus = action.payload
      return {...state}
    case 'update_video_status':
      state.mediaConstraints.myVideoStatus = action.payload
      return {...state}
    case 'update_audio_constraint':  
      state.mediaConstraints.useAudio  = action.payload
      return {...state}
    case 'update_video_constraint':
      state.mediaConstraints.useVideo  = action.payload
      return {...state}

    case 'update_record_state':
        state.mediaConstraints.isRecScreenSream = action.payload
        return {...state}
    default:
      return state
  }
}

