import { configureStore, createSlice } from '@reduxjs/toolkit';

export let matchingReducer = createSlice({
  name : 'matchingReducer',
  initialState:{ questionData:[] },
  reducers : {
    getQuestionData: (state, action) => {
      state.questionData = action.payload
    }
  }
})

export let { getQuestionData } = matchingReducer.actions;

export default matchingReducer