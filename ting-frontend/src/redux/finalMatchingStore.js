import { createSlice } from '@reduxjs/toolkit';

export let finalMatchingReducer = createSlice({
  name : 'finalMatchingReducer',
  initialState:{ matchingId:'' },
  reducers : {
    setFinalMatchingId: (state, action) => {
      state.matchingId = action.payload
    }
  }
})

export let { setFinalMatchingId } = finalMatchingReducer.actions;

export default finalMatchingReducer