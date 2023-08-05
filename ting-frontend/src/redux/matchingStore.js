import { configureStore, createSlice } from "@reduxjs/toolkit";

export let matchingReducer = createSlice({
  name: "matchingReducer",

  initialState: {
    openviduSession: null,
    questionData: {},
    questionNumber: 0,
    matchingId: null,
    myScore: [],
    yourScore: [],
    yourData: {},
  },
  reducers: {
    setQuestionData: (state, action) => {
      state.questionData = action.payload;
      console.log("++++++++++++++ Redux QuestionData 저장 +++++++++++++++")
      console.log(state.questionData)
    },
    setQuestionNumber: (state, action) => {
      state.questionNumber = action.payload;
      console.log("++++++++++++++ Redux QuestionNumber 저장 +++++++++++++++")
      console.log(state.questionNumber)
    },
    setMatchingId: (state, action) => {
      state.matchingId = action.payload;
      console.log("++++++++++++++ Redux Matching ID 저장 +++++++++++++++")
      console.log(state.matchingId)
    },
    setYourData: (state, action) => {
      state.yourData = action.payload;
      console.log("++++++++++++++ Redux YourData 저장 +++++++++++++++")
      console.log(state.yourData)
    },
    setOpenviduSession: (state, action) => {
      state.openviduSession = action.payload;
      console.log("++++++++++++++ Redux OpenviduSession 저장 +++++++++++++++")
      console.log(state.openviduSession)
    },
    setMyScore:(state,action)=>{
      state.myScore = [...state.myScore, action.payload];
      console.log("++++++++++++++ Redux myScore 저장 +++++++++++++++")
      console.log(state.myScore)
    },
    setYourScore:(state,action)=>{
      state.yourScore = [...state.yourScore, action.payload];
      console.log("++++++++++++++ Redux yourScore 저장 +++++++++++++++")
      console.log(state.yourScore)
    },
  },
});

export let { setQuestionData, 
  setQuestionNumber, 
  setMatchingId, 
  setYourData, 
  setOpenviduSession, 
  setMyScore, 
  setYourScore 
} = matchingReducer.actions;

export default matchingReducer;
