import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GetFetchQuotes } from '../../../api/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { roomAdd } from '../../../redux/thunk'
import DetectRTC from 'detectrtc'

// const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/?key=demo2'

// const peerInfo = getPeerInfo()
// let peerGeo
// let myVideoStatus = false
// let myAudioStatus = false
// let isRecScreenSream = false
// let videoMaxFramRate = 0

/**
 *
 * @param {socket instance} props
 * @returns Content component
 */
const Content = (props) => {
  const navigate = useNavigate()
  // const { id } = useParams()
  // console.log(id)

  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const [contents, setContents] = useState([])



  const joinRoom = (e) => {
    const roomId = e.target.value
    // pass user peer config and emit join event in the child component
    // navigate(roomId, {state: roomId})


    return navigate(`/view/${roomId}`, { replace: true })


    // e.preventDefault()
  }

  useEffect(() => {
     GetFetchQuotes({
      // uri: 'https://dbd6-211-171-1-210.ngrok.io/roomList',
      // uri: 'https://106.255.237.50:4000/roomList',
      uri: 'https://enjoystreet.kr/roomList',
      msg: 'GET current Room Contents information',
    }).then((result) => {
      setContents(result)
    })
  }, [state.roomContents])

  
  if (contents.length !== 0) {
    return (
      <div className='content'>
        {contents.map((el, idx) => 
        {
          let thumnail = `https://enjoystreet.kr/uploads/${el.setConfig[0].Thumbnail}`

          // let thumnail = `https://106.255.237.50:4000/uploads/${el.setConfig[0].Thumbnail}`
          return (
            <form key={idx}>
          <img width={100} height={50}alt='thumbnail' src={thumnail} />
              <div>
                {el.setConfig[0].Title}
                <br />
                <div >{el.setConfig[0].Host} </div>
           <div>{el.setConfig[0].RoomCategory}</div>
                <button type='button' onClick={joinRoom} value={el.RoomId}>
                  join
                </button>
              </div>
            </form>
          )
        })}
      </div>
    )
  } else {
    return <div className='emptyContent'>empty content</div>
  }
}

export default Content

// /**
//  * Get peer info using DetecRTC
//  * https://github.com/muaz-khan/DetectRTC
//  * @returns Obj peer info
//  */
// function getPeerInfo() {
//   return {
//     detectRTCversion: DetectRTC.version,
//     isWebRTCSupported: DetectRTC.isWebRTCSupported,
//     isMobileDevice: DetectRTC.isMobileDevice,
//     osName: DetectRTC.osName,
//     osVersion: DetectRTC.osVersion,
//     browserName: DetectRTC.browser.name,
//     browserVersion: DetectRTC.browser.version,
//   }
// }

// /**
//  * Get approximative peer geolocation
//  * @returns json
//  */
// function getPeerGeoLocation() {
//   fetch(peerLoockupUrl)
//     .then((res) => res.json())
//     .then((outJson) => {
//       peerGeo = outJson
//     })
//     .catch((err) => console.error(err))
// }
