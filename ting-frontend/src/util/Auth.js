import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

function Auth(SpecificComponent, adminRoute = null) {
  const navigate = useNavigate();

  const AuthenticationCheck = () => {
    const state = useSelector((state) => state);

    const user = state.userdataReducer.userdata;

    // 관리자 페이지 접근 권한
    if (adminRoute && user && user.email !== "admin@admin.com") {
      Swal.fire({ title: "관리자만 접근 가능한 페이지 입니다.", width: 400 });
      navigate("/");
      return;
    }

    // 유저 접근 권한
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
