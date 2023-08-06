import { configureStore, createSlice } from "@reduxjs/toolkit";

export let matchingReducer = createSlice({
  name: "matchingReducer",

  initialState: {
    questionData: {},
    questionNumber: 0,
    matchingId: null,
    myScore: [],
    yourScore: [],
    yourData: {},
    matchingResult:null,
  },
  reducers: {
    resetMatchingStore: (state) => {
      state.questionData = {};
      state.questionNumber = 0;
      state.matchingId = null;
      state.myScore = [];
      state.yourScore = [];
      state.yourData = {};
      state.matchingResult = null;
    },

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
    setMatchingResult:(state,action)=>{
      state.matchingResult = action.payload;
      console.log("++++++++++++++ matchingResult 저장 +++++++++++++++")
      console.log(state.matchingResult)
    }

  },
});

export let { setQuestionData, 
  setQuestionNumber, 
  setMatchingId, 
  setYourData, 
  setMyScore, 
  setYourScore,
  setMatchingResult,
  resetMatchingStore
} = matchingReducer.actions;

export default matchingReducer;
