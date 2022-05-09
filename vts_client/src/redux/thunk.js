export const userAuthenticate = (userToken) => async(dispatch, getState) => {
  dispatch({type: 'user_authenticated', payload: userToken})
}

export const dummyDataUpdate = () => async (dispatch, getState) => {
  dispatch({ type: 'dummy_dispatch', payload: 'dummy updated!' })
}

export const roomAdd = () => async (dispatch, getState) => {
  let newRoomContents = getState().roomContents
  dispatch({ type: 'room_add', payload: newRoomContents + 1 })
}

export const testUpdate = () => async (dispatch, getState) => {
  dispatch({ type: 'test_update', payload: getState().testNum + 1 })
}

export const createLocalMedia = (stream) => async(dispatch, getState) => {
  dispatch({type: 'set_local_media_stream', payload: stream })
}

export const updateLocalMedia = (stream) => async (dispatch, getState) => {
  dispatch({ type: 'update_local_media_stream', payload: stream })
}

export const audioUpdate = (option) => async(dispatch, getState) => {
  dispatch({type: 'update_audio_status', payload: option})
}

export const videoUpdate = (option) => async(dispatch, getState) => {
  dispatch({type: 'update_video_status', payload: option})
}

export const audioConstraintUpdate = (option) => async(dispatch, getState) => {
  dispatch({type: 'update_audio_constraint', payload: option})
}

export const videoConstraintUpdate = (option) => async(dispatch, getState) => {
  dispatch({type: 'update_video_constraint', payload: option})
}

export const recStateUpdate = (option) =>  async(dispatch, getState)=>{
  dispatch({type: 'update_record_state', payload: option})
}

