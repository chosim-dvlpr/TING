import './App.css';
import {Routes, Route, Link, useNavigate, Outlet} from 'react-router-dom'
import { useEffect, useState } from 'react';
import Login from './pages/user/Login.js'
import Signup from './pages/user/Signup.js'
import SignupEmail from './pages/user/Signup/Email.js'
import CertificationEmail from './pages/user/Signup/CertificationEmail.js'
import SignupPassword from './pages/user/Signup/Password.js'
import SignupPhoneNumber from './pages/user/Signup/PhoneNumber.js'
import CertificationPhonenumber from './pages/user/Signup/CertificationPhoneNumber.js'
import SignupDetail from './pages/user/Signup/Detail.js'


function App() {
  let accessToken = localStorage.getItem('access-token');
  // accessToken이 있다면 isLogin에 true 저장
  let [isLogin, setIsLogin] = useState("");

  const handleLogout = () => {
    localStorage.removeItem('access-token'); // localStorage의 access-token 삭제
    setIsLogin(false);
  };

  return (
    <div className="App">
      <div className="mainNav">
        <div className='navLeft'>
          <img src="" alt="logo"></img>
          <Link className="navMenu" to="/">메인</Link>
          <Link className="navMenu" to="/tutorial">튜토리얼</Link>
          <Link className="navMenu" to="/community">커뮤니티</Link>
        </div>
        <div className='navRight'>
          {/* <Link className="navMenu" to="/login">로그인</Link>
          <Link className="navMenu" to="/signup">회원가입</Link> */}
          {!isLogin && <Link className="navMenu" to="/login">로그인</Link>}
          {!isLogin && <Link className="navMenu" to="/signup">회원가입</Link>}
          {isLogin && <button onClick={handleLogout}>로그아웃</button>}
        </div>
      </div>
      <Routes>
        <Route path="/" element={
          <div>
            홈!
            <h3>로그인 상태 : { isLogin }</h3>
            </div>
        }></Route>
        <Route path="/tutorial" element={ <div>튜토리얼!!</div> }></Route>
        <Route path="/community" element={ <div>커뮤니티</div> }></Route>
        <Route path="/login" element={ <Login/> }></Route>

        <Route path="/signup" element={ <Signup/>}>
          <Route path="" element={ <SignupEmail/> }></Route>
          <Route path="certEmail" element={ <CertificationEmail/> }></Route>
          <Route path="password" element={ <SignupPassword/> }></Route>
          <Route path="phonenum" element={ <SignupPhoneNumber/> }></Route>
          <Route path="certPhonenum" element={ <CertificationPhonenumber/> }></Route>
          <Route path="detail" element={ <SignupDetail/> }></Route>
        </Route>

      </Routes>

    </div>
  );
}

export default App;
