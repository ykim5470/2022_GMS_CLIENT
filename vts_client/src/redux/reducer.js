import { io } from 'socket.io-client'

const signalingServerPort = 4001
// const signalingServer = 'https://dbd6-211-171-1-210.ngrok.io'
const signalingServer = 'https://106.255.237.50:4000'

let signalingSocket = io(signalingServer, {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'webrtcSocketFromClient',
  },
})

// init state
const initialState = {
  dummy: 'dummy',
  signalingSocket: signalingSocket,
  roomContents: 0,
  testNum: 1,
  localMediaStream: null,
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
    default:
      return state
  }
}
