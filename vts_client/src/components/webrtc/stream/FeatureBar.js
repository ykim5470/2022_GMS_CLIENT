import React, {  useRef, useEffect } from 'react'

function handleAudio(audioStatus) {
  return (audioStatus.current = !audioStatus)
}

function handleVideo(videoStatus) {
  return (videoStatus.current = !videoStatus)
}

function getSupportedMimeTypes() {
  const possibleTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/mp4;coidecs=h264,aac',
    'video/mp4',
  ]
  return possibleTypes.filter((mimeType) => {
    return MediaRecorder.isTypeSupported(mimeType)
  })
}

function startRecording(recordedBlobs, isMobileDevice) {
  let options = getSupportedMimeTypes()

  console.log('MediaRecorder options supprted', options)
  options = { mimeType: options[0] }

  try {
    if (isMobileDevice) {
      return
    }
  } catch (err) {
    console.error(err)
  }
}

function stopRecording() {
  return
}

const FeatureBar = () => {
  const audioStatus = useRef('')
  const videoStatus = useRef('')
  const recStatus = useRef(false)
  const recordedBlobs = useRef([])
  const isMobileDevice = useRef(false)

  useEffect(() => {}, [])

  console.log(audioStatus.current)

  return (
    <div className='featureBar'>
      Feature box
      <section className='MediaController'>
        <button className='audioBtn' ref={audioStatus} onClick={handleAudio}>
          audio
        </button>
        <button className='videoBtn' ref={videoStatus} onClick={handleVideo}>
          video
        </button>
        <button
          className='recordStreamBtn'
          ref={recStatus}
          onClick={
            recStatus
              ? startRecording(recordedBlobs, isMobileDevice)
              : stopRecording
          }>
          rec
        </button>
      </section>
    </div>
  )
}

export default FeatureBar
