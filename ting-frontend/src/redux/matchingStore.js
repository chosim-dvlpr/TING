import { configureStore, createSlice } from "@reduxjs/toolkit";

export let matchingReducer = createSlice({
  name : 'matchingReducer',
  initialState:{ questionData:{}, questionNumber:0 , matchingId: null},
  reducers : {
    setQuestionData: (state, action) => {
      state.questionData = action.payload
      console.log('데이터 저장 됫나')
      console.log(action.payload)
    },
    setQuestionNumber: (state, action) => {
      state.questionNumber = action.payload;
      console.log("리덕스 안", state.questionNumber);
    },
    setMatchingId: (state, action) => {
      state.matchingId = action.payload;
    },
  },
});

export let { setQuestionData, setQuestionNumber, setMatchingId } = matchingReducer.actions;

export default matchingReducer;
