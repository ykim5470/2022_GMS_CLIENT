import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


export default function useRoomState() {
    const state = useSelector(state => state)
    const room = state.signalingSocket
    const [roomState, setRoomState] = useState(room.connected)

    console.log('room', room)
    console.log('roomState', roomState)

    if (!room) {
        throw new Error('Client Socket is not connected to Server!')
    } else {
        // 페이지 적용을 위해서 useEffect 사용, ex) 새로고침시 disconnected가 true connected 이 false
        useEffect(
            () => {
                console.log(room.connected)
                setRoomState(room.connected)
            }, [room]
        )
    }

    return roomState
}