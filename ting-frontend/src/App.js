import './App.css';
import {Routes, Route, Link} from 'react-router-dom'

// 로그인, 회원가입
import Login from './pages/user/Login.js'
import Signup from './pages/user/Signup.js'
import SignupEmail from './pages/user/Signup/Email.js'
import CertificationEmail from './pages/user/Signup/CertificationEmail.js'
import SignupPassword from './pages/user/Signup/Password.js'
import SignupPhoneNumber from './pages/user/Signup/PhoneNumber.js'
import CertificationPhonenumber from './pages/user/Signup/CertificationPassword.js'
import SignupDetail from './pages/user/Signup/Detail.js'
import Openvidu from './pages/openvidu/openvidu-main.js';

// 메인페이지
import Main from './pages/main/Main.js'

// 매칭

import Matching from './pages/matching/Matching.js';
import WaitingRoom from './component/matching/WaitingRoom.js';
import MatchingStart from './component/matching/MatchingStart.js';

// 커뮤니티

import Community from './pages/community/Community.js';



function App() {

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
          <Link className="navMenu" to="/login">로그인</Link>
          <Link className="navMenu" to="/signup">회원가입</Link>
        </div>
      </div>
      <Routes>
        {/* 네비게이션 바 */}
        <Route path="/" element={ <Main/> }></Route>
        <Route path="/tutorial" element={ <div>튜토리얼!!</div> }></Route>
        <Route path="/community" element={ <div>커뮤니티</div> }></Route>
        <Route path="/login" element={ <Login/> }></Route>

        {/* 회원가입 */}
        <Route path="/signup" element={ <Signup/> }>
          <Route path="" element={ <SignupEmail/> }></Route>
          <Route path="certEmail" element={ <CertificationEmail/> }></Route>
          <Route path="password" element={ <SignupPassword/> }></Route>
          <Route path="phonenum" element={ <SignupPhoneNumber/> }></Route>
          <Route path="certPhonenum" element={ <CertificationPhonenumber/> }></Route>
          <Route path="detail" element={ <SignupDetail/> }></Route>
        </Route>

        {/* 매칭 */}
        <Route path="/matching" element={< Matching/> }>
          <Route path="" element={ <WaitingRoom/> }></Route>
          <Route path="start" element={ <MatchingStart/> }></Route>
        </Route>

        <Route path="/testopenvidu" element={<Openvidu/>}></Route>

        {/* 커뮤니티 페이지 */}
        <Route path="/community/*" element={<Community />} />

      </Routes>

    </div>
  );
}

export default App;
