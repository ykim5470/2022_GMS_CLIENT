import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

import SetupBox from './SetupBox'
import Media from './Media'


import useRoomState from '../../../hooks/useRoomState/useRoomState'

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto'
})

const Main = styled('main')((theme) => ({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight}px`,
  background: '#FFFFF'
}))


const Stream = () => {
  const state = useSelector((state) => state)
  // 뒤로가기를 위한 navigate, 어디로 뒤로 갈지 설정필요
  const navigate = useNavigate()

  // hooks를 통해 room의 상태를 가져온다
  const roomState = useRoomState()
  console.log('roomState', roomState)
  // 룸에 대한 로컬 state 관리는 훅을 통해서 하고, 만약 이벤트 가 발생시 (새로고침) 방상태가 변하기 때문에 거기에 대한 후속 조치
  if (!roomState) {
    return <div>Warning! This room is currently not connected to server! Please Create a new room.
      <Button onClick={() => {
        const id = '1'
        return navigate(`/guide${id}/landing`)
      }}>Back</Button>
    </div>
  } else {
    return (
      <Container>
        {(state.localMediaStream == null) ? (
          <SetupBox socket={state.signalingSocket} />
        ) :
          (
            <Main>
              <Media
                socket={state.signalingSocket}
              />
            </Main>)
        }
      </Container>
    )
  }
}

export default Stream
