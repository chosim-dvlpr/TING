import "./App.css";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.js";
import SignupPage from "./pages/SignupPage.js";
import SignupEmail from "./component/signup/Email.js";
import CertificationEmail from "./component/signup/CertificationEmail.js";
import SignupPassword from "./component/signup/Password.js";
import SignupPhoneNumber from "./component/signup/PhoneNumber.js";
import CertificationPhonenumber from "./component/signup/CertificationPhoneNumber.js";
import SignupDetail from "./component/signup/Detail.js";
import SelectionData from "./component/signup/SelectionData";
import Mbti from "./component/signup/select/Mbti";
import Height from "./component/signup/select/Height";
import Smoke from "./component/signup/select/Smoke";
import Drink from "./component/signup/select/Drink";
import Religion from "./component/signup/select/Religion";
import Job from "./component/signup/select/Job";
import Hobby from "./component/signup/select/Hobby";
import Personality from "./component/signup/select/Personality";
import Style from "./component/signup/select/Style";
import Introduce from "./component/signup/select/Introduce";
import Openvidu from "./pages/openvidu/openvidu-main.js";

// 메인페이지
import MainPage from "./pages/MainPage";

//NavBar
import NavBar from "./component/common/NavBar";

// 매칭
import MatchingPage from "./pages/MatchingPage.js";
import WaitingRoom from "./component/matching/WaitingRoom.js";
import MatchingStart from "./component/matching/MatchingStart.js";
import MatchingResult from "./component/matching/MatchingResult";

// 커뮤니티

import CommunityPage from "./pages/CommunityPage.js";
import AdviceBoard from "./component/community/advice/AdviceBoard";
import AdviceDetail from "./component/community/advice/AdviceDetail";
import AdviceCreate from "./component/community/advice/AdviceCreate";
import AdviceUpdate from "./component/community/advice/AdviceUpdate";
import IssueBoard from "./component/community/issue/IssueBoard";
import IssueCreate from "./component/community/issue/IssueCreate";
import IssueDetail from "./component/community/issue/IssueDetail";

// 튜토리얼
import TutorialPage from "./pages/TutorialPage";

// 내 프로필
import MyProfilePage from "./pages/MyProfilePage";
import DeleteAccount from "./component/profile/DeleteAccount";
import MyArticle from "./component/profile/MyArticle";
import MyInformation from "./component/profile/MyInformation";
import MyInformationUpdate from "./component/profile/MyInformationUpdate";
import PasswordUpdate from "./component/profile/PasswordUpdate";
import QnaBoard from "./component/profile/QnaBoard";
import QnaCreate from "./component/profile/QnaCreate";

// 아이템
import ItemPage from "./pages/ItemPage";

// 관리자
import AdminPage from "./pages/AdminPage";
import Dashboard from "./component/admin/Dashboard";
import Report from "./component/admin/Report";
import User from "./component/admin/User";
import Qna from "./component/admin/Qna";

// 친구
import Friend from "./component/friend/Friend";
import FriendList from "./component/friend/FriendList";
import FriendChatting from "./component/friend/FriendChatting";
import FriendProfile from "./component/friend/FriendProfile";

// 아이템샵
import ItemShop from "./component/item/ItemShop";
import MyItem from "./component/item/MyItem";
import MyPoint from "./component/item/MyPoint";

// 카카오 페이 결제
import KakaoPaySuccess from "./pages/pay-result-page/KakaoPaySuccess.js";
import QnaDetail from "./component/profile/QnaDetail";

import KakaoPayCancel from "./pages/pay-result-page/KakaoPayCancel";
import KakaoPayFail from "./pages/pay-result-page/KakaoPayFail";
import ProfileImage from "./component/signup/select/profileImage";

function App() {
  let accessToken = localStorage.getItem("access-token");
  // accessToken이 있다면 isLogin에 true 저장
  let [isLogin, setIsLogin] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access-token"); // localStorage의 access-token 삭제
    setIsLogin(false);
  };

  return (
    <div className="App">
      {/* <NavBar/> */}

      <Routes>
        {/* 네비게이션 바 */}
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/tutorial" element={<TutorialPage />}></Route>
        <Route path="/community//*" element={<CommunityPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>

        {/* 회원가입 */}
        <Route path="/signup" element={<SignupPage />}>
          <Route path="" element={<SignupEmail />}></Route>
          <Route path="certEmail" element={<CertificationEmail />}></Route>
          <Route path="password" element={<SignupPassword />}></Route>
          <Route path="phonenum" element={<SignupPhoneNumber />}></Route>
          <Route path="certPhonenum" element={<CertificationPhonenumber />}></Route>
          <Route path="detail" element={<SignupDetail />}></Route>
          <Route path="select" element={<SelectionData />}>
            <Route path="mbti" element={<Mbti />}></Route>
            <Route path="height" element={<Height />}></Route>
            <Route path="drink" element={<Drink />}></Route>
            <Route path="smoke" element={<Smoke />}></Route>
            <Route path="religion" element={<Religion />}></Route>
            <Route path="job" element={<Job />}></Route>
            <Route path="hobby" element={<Hobby />}></Route>
            <Route path="personality" element={<Personality />}></Route>
            <Route path="style" element={<Style />}></Route>
            <Route path="introduce" element={<Introduce />}></Route>
            <Route path="profileimage" element={<ProfileImage />}></Route>
          </Route>
        </Route>

        {/* 매칭 */}
        <Route path="/matching" element={<MatchingPage />}>
          <Route path="" element={<WaitingRoom />}></Route>
          <Route path="start" element={<MatchingStart />}></Route>
          <Route path="result" element={<MatchingResult />}></Route>
        </Route>

        {/* 커뮤니티 페이지 */}

        <Route path="/community//*" element={<CommunityPage />} />

        <Route path="/community/advice/detail/:adviceId" element={<AdviceDetail />} />
        <Route path="/community/advice" element={<AdviceBoard />} />
        <Route path="/community/advice/create" element={<AdviceCreate />} />
        <Route path="/community/advice/update/:adviceId" element={<AdviceUpdate />} />

        <Route path="/community/issue" element={<IssueBoard />} />
        <Route path="/community/issue/create" element={<IssueCreate />} />
        <Route path="/community/issue/detail/:issueId" element={<IssueDetail />} />

        {/* 친구목록 임시 */}
        <Route path="/friend" element={<Friend />}>
          <Route path="" element={<FriendList />}></Route>
          <Route path="chat" element={<FriendChatting />}></Route>
        </Route>

        {/* 마이페이지 */}
        <Route path="/mypage" element={<MyProfilePage />}>
          <Route path="" element={<MyInformation />}></Route>
          <Route path="update" element={<MyInformationUpdate />}></Route>
          <Route path="passwordupdate" element={<PasswordUpdate />}></Route>
          <Route path="qna" element={<QnaBoard />}></Route>
          <Route path="qnadetail" element={<QnaDetail />} />
          <Route path="qnacreate" element={<QnaCreate />} />
          <Route path="myarticle" element={<MyArticle />}></Route>
          <Route path="deleteaccount" element={<DeleteAccount />}></Route>
        </Route>

        {/* 아이템 페이지 */}
        <Route path="/item" element={<ItemPage />}>
          {/* 아이템 상점 */}
          <Route path="shop" element={<ItemShop />}></Route>
          {/* 보유 아이템 관리 */}
          <Route path="myitem" element={<MyItem />}></Route>
          {/* 포인트 충전 및 관리 */}
          <Route path="mypoint" element={<MyPoint />}></Route>
        </Route>

        {/* 카카오페이 결과 */}
        <Route path="/payment/kakaoPaySuccess" element={<KakaoPaySuccess />} />
        <Route path="/payment/kakaoPayCancel" element={<KakaoPayCancel />} />
        <Route path="/payment/kakaoPayFail" element={<KakaoPayFail />} />

        <Route path="/admin" element={<AdminPage />}>
          <Route path="" element={<Dashboard />}></Route>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="report" element={<Report />} />
          <Route path="user" element={<User />} />
          <Route path="qna" element={<Qna />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
