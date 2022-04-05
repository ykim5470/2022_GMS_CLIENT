import React, { useEffect, useState, useRef } from 'react'

/**
 *
 * @param {socket instance, localMedia} props
 * @returns Media component
 */
const Media = (props) => {
  const signalingSocket = props.socket
  const localMedia = props.localMedia
  console.log(localMedia)

  const videoRef = useRef({})
  console.log(videoRef)

  // if (localMedia && !videoRef.current.srcObject) {
  //   videoRef.current.srcObject = localMedia
  // }

  useEffect(() => {
    if (localMedia && !videoRef.current.srcObject)
      videoRef.current.srcObject = localMedia
  })

  // videoRef.current.srcObject = localMedia
  // signalingSocket.emit()
  return (
    <div className='media'>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  )
}

export default Media
