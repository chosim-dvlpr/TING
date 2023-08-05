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
      console.log("데이터 저장 됫나");
      console.log(action.payload);
    },
    setQuestionNumber: (state, action) => {
      state.questionNumber = action.payload;
      console.log("리덕스 안 카드 숫자", state.questionNumber);
    },
    setMatchingId: (state, action) => {
      state.matchingId = action.payload;
    },
    setYourData: (state, action) => {
      state.yourData = action.payload;
    },
    setOpenviduSession: (state, action) => {
      state.openviduSession = action.payload;
      console.log("세션", state.openviduSession);
    },
    setMyScore:(state,action)=>{
      state.myScore = [...state.myScore, action.payload];
      console.log('redux 안 내점수 저장', state.myScore)
    },
    setYourScore:(state,action)=>{
      state.yourScore = [...state.yourScore, action.payload];
      console.log('redux 안 상대방 점수 저장', state.yourScore)
    },
    setYourScore: (state, action) => {
      state.yourScore = action.payload;
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
