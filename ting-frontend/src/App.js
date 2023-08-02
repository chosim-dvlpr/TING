import './App.css';
import {Routes, Route, Link, useNavigate, Outlet} from 'react-router-dom'
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage.js'
import SignupPage from './pages/SignupPage.js'
import SignupEmail from './component/signup/Email.js'
import CertificationEmail from './component/signup/CertificationEmail.js'
import SignupPassword from './component/signup/Password.js'
import SignupPhoneNumber from './component/signup/PhoneNumber.js'
import CertificationPhonenumber from './component/signup/CertificationPhoneNumber.js'
import SignupDetail from './component/signup/Detail.js'
import SelectionData from './component/signup/SelectionData';
import Mbti from './component/signup/select/Mbti';
import Height from './component/signup/select/Height';
import Smoke from './component/signup/select/Smoke';
import Drink from './component/signup/select/Drink';
import Religion from './component/signup/select/Religion';
import Job from './component/signup/select/Job';
import Hobby from './component/signup/select/Hobby';
import Personality from './component/signup/select/Personality';
import Style from './component/signup/select/Style';
import Introduction from './component/signup/select/Introduction';
import Openvidu from './pages/openvidu/openvidu-main.js';

// 메인페이지
import MainPage from './pages/MainPage';

// 매칭
import MatchingPage from './pages/MatchingPage.js';
import WaitingRoom from './component/matching/WaitingRoom.js';
import MatchingStart from './component/matching/MatchingStart.js';
import MatchingFinal from './component/matching/MatchingFinal';


// 커뮤니티

import CommunityPage from './pages/CommunityPage.js';
import AdvicePostForm from './component/community/advice/AdviceCreate.js'

// 튜토리얼
import TutorialPage from './pages/TutorialPage';

// 내 프로필
import MyProfilePage from './pages/MyProfilePage';

// 아이템
import ItemPage from './pages/ItemPage';

// 관리자
import AdminPage from './pages/AdminPage';

// 친구
import FriendList from './component/friend/FriendList';
import Friend from './component/friend/Friend';
import FriendChatting from './component/friend/FriendChatting';
import FriendProfile from './component/friend/FriendProfile';

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
        
        {/* 친구목록 임시 */}
        <Route path="/friend" element={<Friend />}>
          <Route path="" element={<FriendList />}></Route>
          <Route path="chat" element={<FriendChatting />}></Route>
        </Route>
        
      </Routes>

    </div>
  );
}

export default App;
