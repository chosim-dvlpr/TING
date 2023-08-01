import './App.css';
import {Routes, Route, Link, useNavigate, Outlet} from 'react-router-dom'
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage.js'
import SignupPage from './pages/SignupPage.js'
import SignupEmail from './pages/user/Signup/Email.js'
import CertificationEmail from './pages/user/Signup/CertificationEmail.js'
import SignupPassword from './pages/user/Signup/Password.js'
import SignupPhoneNumber from './pages/user/Signup/PhoneNumber.js'
import CertificationPhonenumber from './pages/user/Signup/CertificationPhoneNumber.js'
import SignupDetail from './pages/user/Signup/Detail.js'
import SelectionData from './pages/user/SelectionData';
import Mbti from './pages/user/Select/Mbti';
import Height from './pages/user/Select/Height';
import Smoke from './pages/user/Select/Smoke';
import Drink from './pages/user/Select/Drink';
import Religion from './pages/user/Select/Religion';
import Job from './pages/user/Select/Job';
import Hobby from './pages/user/Select/Hobby';
import Personality from './pages/user/Select/Personality';
import Style from './pages/user/Select/Style';
import Introduction from './pages/user/Select/Introduction';
import Openvidu from './pages/openvidu/openvidu-main.js';

// 메인페이지
import MainPage from './pages/MainPage';

// 매칭

import MatchingPage from './pages/MatchingPage.js';
import WaitingRoom from './component/matching/WaitingRoom.js';
import MatchingStart from './component/matching/MatchingStart.js';

// 커뮤니티

import CommunityPage from './pages/CommunityPage.js';
import AdvicePostForm from './pages/community/AdvicePostForm.js'

// 튜토리얼
import TutorialPage from './pages/TutorialPage';

// 내 프로필
import MyProfilePage from './pages/MyProfilePage';

// 아이템
import ItemPage from './pages/ItemPage';

// 관리자
import AdminPage from './pages/AdminPage';

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
        {/* 네비게이션 바 */}
        <Route path="/" element={ <MainPage/> }></Route>
        <Route path="/tutorial" element={ <div>튜토리얼!!</div> }></Route>
        <Route path="/community/*" element={ <CommunityPage /> }></Route>
        <Route path="/login" element={ <LoginPage/> }></Route>

        {/* 회원가입 */}
        <Route path="/signup" element={ <SignupPage/> }>
          <Route path="" element={ <SignupEmail/> }></Route>
          <Route path="certEmail" element={ <CertificationEmail/> }></Route>
          <Route path="password" element={ <SignupPassword/> }></Route>
          <Route path="phonenum" element={ <SignupPhoneNumber/> }></Route>
          <Route path="certPhonenum" element={ <CertificationPhonenumber/> }></Route>
          <Route path="detail" element={ <SignupDetail/> }></Route>
          <Route path="select" element={ <SelectionData/> }>
            <Route path="mbti" element={ <Mbti/> }></Route>
            <Route path="height" element={ <Height/> }></Route>
            <Route path="drink" element={ <Drink/> }></Route>
            <Route path="smoke" element={ <Smoke/> }></Route>
            <Route path="religion" element={ <Religion/> }></Route>
            <Route path="job" element={ <Job/> }></Route>
            <Route path="hobby" element={ <Hobby/> }></Route>
            <Route path="personality" element={ <Personality/> }></Route>
            <Route path="style" element={ <Style/> }></Route>
            <Route path="introduction" element={ <Introduction/> }></Route>
          </Route>
        </Route>

        {/* 매칭 */}
        <Route path="/matching" element={< MatchingPage/> }>
          <Route path="" element={ <WaitingRoom/> }></Route>
          <Route path="start" element={ <MatchingStart/> }></Route>
        </Route>

        <Route path="/testopenvidu" element={<Openvidu/>}></Route>

        {/* 커뮤니티 페이지 */}

        <Route path="/community/*" element={<CommunityPage />} />
        <Route path="/community/advice/new" element={<AdvicePostForm />} />
    
        </Routes>

    </div>
  );
}

export default App;
