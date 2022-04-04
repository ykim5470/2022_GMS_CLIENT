import React, { useEffect, useState, useRef } from 'react'

/**
 *
 * @param {socket instance} props
 * @returns Media component
 */
const Media = (props) => {
  const signalingSocket = props.socket

  signalingSocket.emit()
  return <div className='media'></div>
}

export default Media
