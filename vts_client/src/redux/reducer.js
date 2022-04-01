import { io } from 'socket.io-client'

const signalingServerPort = 4001
const signalingServer = 'http://localhost:4001'

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
    default:
      return state
  }
}
