import { createSlice } from '@reduxjs/toolkit';

export const signupReducer = createSlice({
  name: 'signupReducer',
  initialState: {
    // 기본값
    email: "",
    password: "",
    phonenumber: "",
    name: "",
    nickname: "",
    gender: "",
    birth: "",
    region: "",
    // 선택값
    profileImage: "",
    mbtiCode: "",
    heightCode: "",
    drinkingCode: "",
    smokingCode: "",
    religionCode: "",
    hobbyCodeList: [],
    jobCode: "",
    personalityCodeList: [],
    introduction: "",
    styleCodeList: [],
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setPhonenumber: (state, action) => {
      state.phonenumber = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setNickname: (state, action) => {
      state.nickname = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    setRegion: (state, action) => {
      state.region = action.payload;
    },
    setBirth: (state, action) => {
      state.birth = action.payload;
    },
    // 여기부터는 선택값
    setMbtiCode: (state, action) => {
      state.mbtiCode = action.payload;
    },
    setHeightCode: (state, action) => {
      state.heightCode = action.payload;
    },
    setDrinkingCode: (state, action) => {
      state.drinkingCode = action.payload;
    },
    setSmokingCode: (state, action) => {
      state.smokingCode = action.payload;
    },
    setReligionCode: (state, action) => {
      state.religionCode = action.payload;
    },
    setAddHobbyCodeList: (state, action) => {
      state.hobbyCodeList.push(action.payload);
    },
    setDeleteHobbyCodeList: (state, action) => {
      state.hobbyCodeList.slice(action.payload, 1);
    },
    setJobCode: (state, action) => {
      state.jobCode = action.payload;
    },
    setAddPersonalityCodeList: (state, action) => {
      state.personalityCodeList.push(action.payload);
    },
    setDeletePersonalityCodeList: (state, action) => {
      state.personalityCodeList.slice(action.payload, 1);
    },
    setIntroduction: (state, action) => {
      state.introduction = action.payload;
    },
    setAddStyleCodeList: (state, action) => {
      state.styleCodeList.push(action.payload);
    },
    setDeleteStyleCodeList: (state, action) => {
      state.styleCodeList.slice(action.payload, 1);
    },
  }
})


export const { setEmail, setPassword, setPhonenumber, setName, setNickname, setGender, setRegion, setBirth,
  setMbtiCode, setHeightCode, setDrinkingCode, setSmokingCode, setReligionCode, setAddHobbyCodeList,
  setDeleteHobbyCodeList, setJobCode, setAddPersonalityCodeList, setDeletePersonalityCodeList, setIntroduction,
  setAddStyleCodeList, setDeleteStyleCodeList, 
} = signupReducer.actions;
export default signupReducer;