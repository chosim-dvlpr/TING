import { useNavigate } from "react-router-dom"

function ProfileSideBar() {
  let Navigation = useNavigate();

  return (
    <div>
      <h1>프로필 사이드바</h1>
      <button onClick={() => Navigation("/mypage")}>내 프로필</button>
      <button onClick={() => Navigation("/mypage/passwordupdate")}>비밀번호 변경</button>
      <button onClick={() => Navigation("/mypage/qna")}>문의하기</button>
      <button onClick={() => Navigation("/mypage/myarticle")}>작성 게시글 조회</button>
      <button onClick={() => Navigation("/mypage/deleteaccount")}>회원 탈퇴</button>
    </div>
  )
}

export default ProfileSideBar