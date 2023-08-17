import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

function Auth(SpecificComponent, adminRoute = null) {
  const navigate = useNavigate();

  const AuthenticationCheck = () => {
    const state = useSelector((state) => state);

    const user = state.userdataReducer.userdata;
    if (!user) {
      Swal.fire({ title: "로그인이 필요한 \n페이지 입니다.", width: 400 });
      navigate("/login");
      return;
    }

    return <SpecificComponent />;
  };
  return AuthenticationCheck;
}

export default Auth;
