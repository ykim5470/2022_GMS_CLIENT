// import {useEffect, useState, useRef} from 'react'
// import { useSelector, useDispatch} from 'react-redux'
// import { createLocalMedia } from '../../redux/thunk'
// import DetectRTC from 'detectrtc'


// const isWebRTCSupported = DetectRTC.isWebRTCSupported
// const isMobileDevice = DetectRTC.isMobileDevice
// const myBrowserName = DetectRTC.browser.name
// const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/?key=demo2'
// let peerGeo = getPeerGeoLocation()
// const peerInfo = getPeerInfo()

// // mediaConstraints: {
// //     useVideo: true, 
// //     useAudio: true, 
// //     myVideoStatus: true, 
// //     myAudioStatus: true, 
// //     isRecScreenSream: false, 
// //     videoMaxFrameRate : 30 
// //   }

// export default function useLocalMediaState() {
//     const state = useSelector(state => state)
//     const dispatch = useDispatch()
//     const localMediaState = state.localMediaStream
//     const mediaConstraintsState = state.mediaConstraints
    

//     const videoConstraints = myBrowserName ==='Firefox' ? getVideoConstraints('useVideo', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo) : getVideoConstraints('default', mediaConstraintsState.videoMaxFrameRate, mediaConstraintsState.useVideo)

//     console.log(videoConstraints)
//     const constraints = {
//         audio: {
//             echoCancellation: true,
//             noiseSuppression: true,
//             sampleRate: 44100,
//           },
//           video: videoConstraints,
//          }

//     navigator.mediaDevices.getUserMedia(constraints).then(stream =>{
//         console.log('Access granted to audio/video')
//         return dispatch(createLocalMedia(stream))
//     })
    
//     console.log(localMediaState)
    
//     return localMediaState
// }


// /**
//  * Get Peer info using DetectRTC 
//  * https://github.com/muaz-khan/DetectRTC
//  * @returns Obj peer info
//  */
//  function getPeerInfo(){
//     return {
//         detectRTCversion: DetectRTC.version,
//         isWebRTCSupported: DetectRTC.isWebRTCSupported,
//         isMobileDevice: DetectRTC.isMobileDevice,
//         osName: DetectRTC.osName,
//         osVersion: DetectRTC.osVersion,
//         browserName: DetectRTC.browser.name,
//         browserVersion: DetectRTC.browser.version,
//       }
// }


// /**
//  * Get approximative peer geolocation
//  * @returns json
//  */
//  function getPeerGeoLocation() {
//     fetch(peerLoockupUrl)
//       .then((res) => res.json())
//       .then((outJson) => {
//         peerGeo = outJson
//       })
//       .catch((err) => console.error(err))
//   }
  
// /**
//  * https://webrtc.github.io/samples/src/content/getusermedia/resolution/
//  */
// function getVideoConstraints(vidoeQuality, videoMaxFrameRate, useVideo){
//     let frameRate = { max: videoMaxFrameRate }
//     switch (vidoeQuality) {
//       case 'useVideo':
//         return useVideo
//       // Firefox not support set frameRate (OverconstrainedError) O.o
//       case 'default':
//         return { frameRate: frameRate }
//       // video cam constraints default
//       case 'qvgaVideo':
//         return {
//           width: { exact: 320 },
//           height: { exact: 240 },
//           frameRate: frameRate,
//         } // video cam constraints low bandwidth
//       case 'vgaVideo':
//         return {
//           width: { exact: 640 },
//           height: { exact: 480 },
//           frameRate: frameRate,
//         } // video cam constraints medium bandwidth
//       case 'hdVideo':
//         return {
//           width: { exact: 1280 },
//           height: { exact: 720 },
//           frameRate: frameRate,
//         } // video cam constraints high bandwidth
//       case 'fhdVideo':
//         return {
//           width: { exact: 1920 },
//           height: { exact: 1080 },
//           frameRate: frameRate,
//         } // video cam constraints very high bandwidth
//       case '4kVideo':
//         return {
//           width: { exact: 3840 },
//           height: { exact: 2160 },
//           frameRate: frameRate,
//         } // video cam constraints ultra high bandwidth
//     default: 
//         return { frameRate: frameRate }
//     }
// }