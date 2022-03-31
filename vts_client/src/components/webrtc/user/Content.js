import React, { useEffect, useState, useRef } from 'react'

/**
 *
 * @param {socket instance} props
 * @returns Content component
 */
const Content = (props) => {
  // const signalingSocket = props.socket

  // signalingSocket.on('connect', () => {})

  const joinRoom = (event) => {
    console.log('join room')

    event.preventDefault()
  }

  return (
    <div className='content'>
      <form onSubmit={joinRoom}>
        <label>Dummy thumbnail</label>
        <br />
        <label>Dummy content title</label>
        <br />

        <input type='submit' value='join' />
      </form>
    </div>
  )
}

export default Content
