const initState = {
  email: "",
  password: "",
  phonenumber: "",
  name: "",
  nickname: "",
  gender: "",
  birth: "",
  region: "",
}

const TEXT = "text";

const signupReducer = (state = initState, action) => {
  return {
    ...state, // 불변성 유지
    type: "text",
    email: action.email, // 변경할 state 값
    password: action.password,
    phonenumber: action.phonenumber,
    name: action.name,
    nickname: action.nickname,
    gender: action.gender,
    birth: action.birth,
    region: action.region,
  };
  // 뒤로가기 눌렀을 때 데이터를 초기화할지?
};

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

export default signupReducer;