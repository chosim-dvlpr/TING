import axios from "axios";

export default axios.create({
  // baseURL: process.env.REACT_APP_LOCAL_URL,
  baseURL: process.env.REACT_APP_SERVER_URL,

  // 서로 다른 도메인(크로스 도메인)에 요청을 보낼 때 요청에 credential 정보를 담아서 보낼 지를 결정하는 항목
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});
