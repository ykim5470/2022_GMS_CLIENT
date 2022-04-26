import {useEffect, useState} from 'react'
import DetectRTC from 'detectrtc'
import {useSelector, useDispatch} from 'react-redux'

const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/?key=demo2'
let peerGeo = getPeerGeoLocation()
const peerInfo = getPeerInfo()


export default function usePeerState(){
    const reduxState = useSelector(state => state)
    // const [myVidoeStatus, setmyVideoStatus] = useState(true)
    // const [myAudioStatus, setmyAudioStatus] = useState(true)
    // const [isRecScreenSream, setIsRecScreenSream] = useState(false)
    // const [videoMaxFrameRate, setVideoMaxFrameRate]= useState(30)
    
    
    


}



/**
 * Get Peer info using DetectRTC 
 * https://github.com/muaz-khan/DetectRTC
 * @returns Obj peer info
 */
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
  