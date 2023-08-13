import { createSlice } from '@reduxjs/toolkit';

export const signupReducer = createSlice({
  name: 'signupReducer',
  initialState: {
    // 기본값
    email: "",
    password: "",
    phoneNumber: "",
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
    introduce: "", // introduce로 바꿈
    styleCodeList: [],
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
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
    setHobbyCodeList: (state, action) => {
      let hobbyIndex = state.hobbyCodeList.indexOf(action.payload);
      if (hobbyIndex > -1) {
        state.hobbyCodeList.splice(hobbyIndex, 1);
      }
      else {
        state.hobbyCodeList.push(action.payload);
      }
    },
    setJobCode: (state, action) => {
      state.jobCode = action.payload;
    },
    setPersonalityCodeList: (state, action) => {
      let personalityIndex = state.personalityCodeList.indexOf(action.payload);
      if (personalityIndex > -1) {
        state.personalityCodeList.splice(personalityIndex, 1);
      }
      else {
        state.personalityCodeList.push(action.payload);
      }    
    },
    setIntroduce: (state, action) => {
      state.introduce = action.payload;
    },
    setStyleCodeList: (state, action) => {
      let styleIndex = state.styleCodeList.indexOf(action.payload);
      if (styleIndex > -1) {
        state.styleCodeList.splice(styleIndex, 1);
      }
      else {
        state.styleCodeList.push(action.payload);
      }       
    },
    setDeleteStyleCodeList: (state, action) => {
      state.styleCodeList.slice(action.payload, 1);
    },
    completeSignupStep: (state) => {
      const keys = Object.keys(state); // state 객체의 모든 키(key)를 배열로 얻기
      // console.log(keys)
      keys.forEach((key, i) => {
        if (key.includes("List")) {
          state[key] = [];
        }
        else {
          state[key] = "";  
        }
      })

    }

  }
})


export const { setEmail, setPassword, setPhoneNumber, setName, setNickname, setGender, setRegion, setBirth,
  setMbtiCode, setHeightCode, setDrinkingCode, setSmokingCode, setReligionCode, setHobbyCodeList,
  setJobCode, setPersonalityCodeList, setIntroduction, setStyleCodeList, completeSignupStep,
} = signupReducer.actions;
export default signupReducer;