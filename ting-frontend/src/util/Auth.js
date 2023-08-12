import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Auth(SpecificComponent, adminRoute = null) {
  const AuthenticationCheck = () => {
    const state = useSelector((state) => state);
    const navigate = useNavigate();

    const user = state.userdataReducer.userdata;

    useEffect(() => {
      if (!user) {
        alert("로그인이 필요한 페이지 입니다.");
        navigate("/login");
        return;
      }
    }, []);

    return <SpecificComponent />;
  };
  return AuthenticationCheck;
}

export default Auth;
