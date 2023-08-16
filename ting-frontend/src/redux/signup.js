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
    height: "",
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
      const hobbyIndex = state.hobbyCodeList.findIndex(data => data.code === action.payload.code);
      if (hobbyIndex > -1) {
        // 이미 존재하는 경우, 해당 항목을 배열에서 제거
        state.hobbyCodeList.splice(hobbyIndex, 1);
      } else {
        // 존재하지 않는 경우, 해당 항목을 배열에 추가
        state.hobbyCodeList.push(action.payload);
      }
    },
    setJobCode: (state, action) => {
      state.jobCode = action.payload;
    },
    setPersonalityCodeList: (state, action) => {
      const personalityIndex = state.personalityCodeList.findIndex(data => data.code === action.payload.code);
      if (personalityIndex > -1) {
        // 이미 존재하는 경우, 해당 항목을 배열에서 제거
        state.personalityCodeList.splice(personalityIndex, 1);
      } else {
        // 존재하지 않는 경우, 해당 항목을 배열에 추가
        state.personalityCodeList.push(action.payload);
      } 
    },
    setIntroduce: (state, action) => {
      state.introduce = action.payload;
    },
    setStyleCodeList: (state, action) => {
      const styleIndex = state.styleCodeList.findIndex(data => data.code === action.payload.code);
      if (styleIndex > -1) {
        // 이미 존재하는 경우, 해당 항목을 배열에서 제거
        state.styleCodeList.splice(styleIndex, 1);
      } else {
        // 존재하지 않는 경우, 해당 항목을 배열에 추가
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
  setJobCode, setPersonalityCodeList, setIntroduce, setStyleCodeList, completeSignupStep,
} = signupReducer.actions;
export default signupReducer;