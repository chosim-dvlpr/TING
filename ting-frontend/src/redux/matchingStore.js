import { configureStore, createSlice } from "@reduxjs/toolkit";
import tokenHttp from "../api/tokenHttp";

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
      console.log('여기서 리덕스 리셋')
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

      // DB에 질문에 대해 받은 점수 저장
      const data = {
        matchingId : state.matchingId,
        questionId : state.questionData[state.questionNumber].id,
        score: action.payload,
        questionOrder : state.questionNumber 
      }
      if ( data.questionOrder > 0 &&  data.questionOrder < 12 ){
        tokenHttp.post('/date/score', data)
          .then((response)=>{
            console.log(response.data.message)
          }).catch(err => console.log(err))
      }
    },

    setMatchingResult:(state,action)=>{
      state.matchingResult = action.payload;
      console.log("++++++++++++++ matchingResult(상대방의 결과) 저장 +++++++++++++++")
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
