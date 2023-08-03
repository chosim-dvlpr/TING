import React from 'react';
import { useState } from 'react';

import './NavBar.module.css'

import {Link} from 'react-router-dom';

const NavBar = () => {
    let accessToken = localStorage.getItem('access-token');
    // accessToken이 있다면 isLogin에 true 저장
    let [isLogin, setIsLogin] = useState("");
  
    const handleLogout = () => {
      localStorage.removeItem('access-token'); // localStorage의 access-token 삭제
      setIsLogin(false);
    };
  
    return (
        <div className="mainNav">
        <div className='navLeft'>
          <img src="img/pixelting.png" className="logo" alt="logo"></img>
          <Link className="navMenu" to="/">메인</Link>
          <Link className="navMenu" to="/tutorial">튜토리얼</Link>
          <Link className="navMenu" to="/community">커뮤니티</Link>
        </div>
        <div className='navRight'>
          
          {!isLogin && <Link className="navMenu" to="/login">로그인</Link>}
          {!isLogin && <Link className="navMenu" to="/signup">회원가입</Link>}
          {isLogin && <button onClick={handleLogout}>로그아웃</button>}
        </div>
      </div>
      );
};

export default NavBar;
