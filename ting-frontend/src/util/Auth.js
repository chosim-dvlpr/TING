import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Auth(SpecificComponent, adminRoute = null) {
  const AuthenticationCheck = () => {
    const state = useSelector((state) => state);

    const user = state.userdataReducer.userdata;
    if (!user) {
      alert("로그인이 필요한 페이지 입니다.");
      window.location.href = "/login";
      return;
    }

    return <SpecificComponent />;
  };
  return AuthenticationCheck;
}

export default Auth;
