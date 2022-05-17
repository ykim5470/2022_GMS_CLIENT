import React from 'react'
import { useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {styled} from '@mui/material/styles'
import {Button} from '@mui/material'

import SetupBox from './SetupBox'
import Media from './Media'


import useRoomState from '../../../hooks/useRoomState/useRoomState'

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto'
})

const Main = styled('main')((theme)=>({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight}px`,
  background: '#FFFFF'
}))


const Stream = () => {
  const state = useSelector((state) => state)
  const navigate = useNavigate()


  const roomState = useRoomState()


  

  if(!roomState){
    return <div>Warning! This room is currently not connected to server! Please Create a new room.
      <Button onClick={()=>{     
      const id  = '1'
      return navigate(`/guide${id}/landing`)}}>Back</Button>
    </div>
  }else{
  return (
    <Container>
      {(state.localMediaStream == null) ? (
        <SetupBox socket={state.signalingSocket} />
      ):        
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
