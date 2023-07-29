
import { useNavigate } from "react-router-dom"
import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import basicHttp from '../../../api/basicHttp';


function Detail(){
  const Navigate = useNavigate()
  let [inputNickname, setInputNickname] = useState("");
  // let [birth, setBirth] = useState("")
  let allContentsNum = 5;
  let [checkAllContents, setCheckAllContents] = useState([false]*allContentsNum);

  let dispatch = useDispatch();
  let email = useSelector((state) => state.signupReducer.email);
  let password = useSelector((state) => state.signupReducer.password);
  let name = useSelector((state) => state.signupReducer.name);
  let nickname = useSelector((state) => state.signupReducer.nickname);
  let phonenumber = useSelector((state) => state.signupReducer.phonenumber);
  let gender = useSelector((state) => state.signupReducer.gender);
  let birth = useSelector((state) => state.signupReducer.birth);
  let region = useSelector((state) => state.signupReducer.region);

  // 한글만 허용하는 패턴
  const koreanPattern = /^[가-힣]*$/;
  // const stringPattern = /^[가-힣]*$/;

  // 이름 작성 확인 - 영문도 포함 가능하도록 수정 필요
  const isNameExist = useCallback(() => {
    let copy_checkAllContents = [...checkAllContents];
    
    if (koreanPattern.test(name)) {
      copy_checkAllContents[0] = true;
      setCheckAllContents(copy_checkAllContents);
    }
    else {
      copy_checkAllContents[0] = false;
      setCheckAllContents(copy_checkAllContents);
    }
  })
  
  // 닉네임 중복 체크
  const handleNicknameIsExist = () => {
    // 닉네임 한글 확인
    // 한글이 아닌 글자가 있다면 경고메세지 출력
    if (!koreanPattern.test(inputNickname)) {
      alert("한글만 입력해주세요.");
    }
    else {
      basicHttp.get(`/user/nickname/${inputNickname}`).then((response) => {
        if (response.data.code === 200) {
          // 닉네임 중복 시
          if (response.data.data === true) {
            alert("닉네임이 중복되었습니다.\n다시 작성해주세요.")
          }
          else {
            alert("닉네임 사용이 가능합니다.");
            let copy_checkAllContents = [...checkAllContents];
            copy_checkAllContents[1] = true;
            setCheckAllContents(copy_checkAllContents);
          }
        }
        else if (response.data.code === 400) {
          console.log('400 error');
        }
      })
      .catch(() => console.log("실패"));
    }
  }

  // 성별 체크 확인
  const genderIsExist = (gender) => {
    // redux에 저장
    dispatch({type: 'text', gender: gender});

    // 항목 확인
    let copy_checkAllContents = [...checkAllContents];
    copy_checkAllContents[2] = true;
    setCheckAllContents(copy_checkAllContents);
  }

  // 생일 입력 확인
  const birthIsExist = useCallback((input) => {
    let copy_checkAllContents = [...checkAllContents];
    if (input.length === 6) {
      // redux에 저장
      dispatch({type: 'text', birth: input});

      // 항목 확인
      copy_checkAllContents[3] = true;
    }
    else {
      copy_checkAllContents[3] = false;
    }
    setCheckAllContents(copy_checkAllContents);
    // console.log(checkAllContents);
  })

  // 회원가입 완료 클릭 시
  const completeSignup = () => {
    if (checkAllContents === [true]*allContentsNum) {
      let data = {
        email: email,
        password: password,
        name: name,
        nickname: nickname,
        phoneNumber: phonenumber,
        gender: gender,
        birth: birth,
        region: region,
      }
      basicHttp.post('/user', data).then((response) => {
        
      })
    }
  }
    

  return(
    <div>
      <p>상세정보를 입력해주세요</p>
      <input type="text" onChange={(e) => {
        dispatch({type: "text", name: e.target.value})
        isNameExist()
        }} value={ name } placeholder="이름"></input>
      <input type="text" onChange={(e) => setInputNickname(e.target.value)} placeholder="닉네임"></input>
      <button onClick={handleNicknameIsExist}>중복확인</button>
      <p>닉네임은 한글로만 작성해야하며, 닉네임은 중복될 수 없습니다.</p>
      <button onClick={() => genderIsExist("male")}>남</button>
      <button onClick={() => genderIsExist("female")}>여</button>
      <br/>
      <input type="text" onChange={(e) => birthIsExist(e.target.value)} placeholder="생년월일 6자리"></input>
      <p>여기 지역 들어가야함</p>
      <button onClick={completeSignup}>회원 가입 완료</button>
      {/* <button onClick={()=>{ Navigate("/signup/beforeSelection")}}>회원 가입 완료</button> */}
    </div>
  )
}

export default Detail