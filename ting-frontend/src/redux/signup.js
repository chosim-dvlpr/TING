import { createSlice } from '@reduxjs/toolkit';

// const initState = {
//   email: "",
//   password: "",
//   phonenumber: "",
//   name: "",
//   nickname: "",
//   gender: "",
//   birth: "",
//   region: "",
// }

// const TEXT = "text";
// const SET_EMAIL = "SET_EMAIL";
// const SET_PASSWORD = "SET_PASSWORD";
// const SET_PHONENUMBER = "SET_PHONENUMBER";
// const SET_NAME = "SET_NAME";
// const SET_NICKNAME = "SET_NICKNAME";
// const SET_GENDER = "SET_GENDER";
// const SET_BIRTH = "SET_BIRTH";
// const SET_REGION = "SET_REGION";

// const signupReducer = (state = initState, action) => {
//   switch (action.type) {
//     case TEXT:
//       return {
//         ...state, // 불변성 유지
//         // type: "text",
//         email: action.email, // 변경할 state 값
//         password: action.password,
//         phonenumber: action.phonenumber,
//         name: action.name,
//         nickname: action.nickname,
//         gender: action.gender,
//         birth: action.birth,
//         region: action.region,
//       };
//     case SET_EMAIL:
//       return {
//         ...state,
//         email: action.email,
//       };
//     case SET_PASSWORD:
//       return {
//         ...state,
//         password: action.password,
//       };
//     case SET_PHONENUMBER:
//       return {
//         ...state,
//         phonenumber: action.phonenumber,
//       };
//     case SET_NAME:
//       return {
//         ...state,
//         name: action.name,
//       };
//     case SET_NICKNAME:
//       return {
//         ...state,
//         nickname: action.nickname,
//       };
//     case SET_GENDER:
//       return {
//         ...state,
//         gender: action.gender,
//       };
//     case SET_BIRTH:
//       return {
//         ...state,
//         birth: action.birth,
//       };
//     case SET_REGION:
//       return {
//         ...state,
//         region: action.region,
//       };
//     default:
//       return state;
//     }
//   // 뒤로가기 눌렀을 때 데이터를 초기화할지?
// };

export const signupReducer = createSlice({
  name: 'signupReducer',
  initialState: {
    email: "",
    password: "",
    phonenumber: "",
    name: "",
    nickname: "",
    gender: "",
    birth: "",
    region: "",
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
    // setName: (state, action) => {
    //   state.name = action.payload;
    // },
    // setName: (state, action) => {
    //   state.name = action.payload;
    // },
    // setName: (state, action) => {
    //   state.name = action.payload;
    // },
    // setName: (state, action) => {
    //   state.name = action.payload;
    // },
    // setName: (state, action) => {
    //   state.name = action.payload;
    // },
  }
})


// const signupReducer = (state = initState, action) => {
//   switch (action.type) {
//     // 성공 시
//     case 200:
//       return {
//         ...state, // 불변성 유지
//         email: action.email, // 변경할 state 값
//         password: action.password,
//         phonenumber: action.phonenumber,
//         name: action.name,
//         nickname: action.nickname,
//         gender: action.gender,
//         birth: action.birth,
//         region: action.region,
//       };
//     // 기본 값
//     default:
//       return state;
//     // 뒤로가기 눌렀을 때 데이터를 초기화할지?
//   }
// };

// export default signupReducer;
export const { setEmail, setPassword, setPhonenumber, setName, setNickname, setGender, setRegion, setBirth } = signupReducer.actions;
export default signupReducer;