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
