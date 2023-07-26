const initState = {
  email: "",
  password: "",
  phoneNumber: "",
  name: "",
  nickname: "",
  gender: "",
  birth: "",
  region: "",
}

const userReducer = (state = initState, action) => {
  switch (action.type) {
    // 성공 시
    case 200:
      return {
        ...state, // 불변성 유지
        email: action.email, // 변경할 state 값
        password: action.password,
        phoneNumber: action.phoneNumber,
        name: action.name,
        nickname: action.nickname,
        gender: action.gender,
        birth: action.birth,
        region: action.region,
      };
    // 기본 값
    default:
      return state;
  }
};

export default userReducer;