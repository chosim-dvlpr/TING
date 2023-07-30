
import { useNavigate } from "react-router-dom"
import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import basicHttp from '../../../api/basicHttp';
import { setGender, setName, setRegion, setBirth, setNickname } from '../../../redux/signup';


function Detail(){
  const Navigate = useNavigate()
  // let [inputName, setInputName] = useState("");
  let [inputNickname, setInputNickname] = useState("");
  let allContentsNum = 5;
  let [checkAllContents, setCheckAllContents] = useState([false, false, false, false, false]); // 리스트 하드코딩 수정하기
  let regionList = ["서울", "부산", "대구", "인천", "광주", 
    "대전", "울산", "경기", "강원" ,"충복", "충남", 
    "세종", "전북", "전남", "경북", "경남", "제주"];

  let dispatch = useDispatch();
  let signupReducer = useSelector((state) => state.signupReducer);
  // let email = useSelector((state) => state.signupReducer.email);
  // let password = useSelector((state) => state.signupReducer.password);
  // let name = useSelector((state) => state.signupReducer.name);
  // let nickname = useSelector((state) => state.signupReducer.nickname);
  // let phonenumber = useSelector((state) => state.signupReducer.phonenumber);
  // let gender = useSelector((state) => state.signupReducer.gender);
  // let birth = useSelector((state) => state.signupReducer.birth);
  // let region = useSelector((state) => state.signupReducer.region);

  // 한글만 허용하는 패턴
  const koreanPattern = /^[가-힣]*$/;
  // const stringPattern = /^[가-힣]*$/;

  // 이름 작성 확인 - 영문도 포함 가능하도록 수정 필요
  const nameIsExist = (data) => {
    let copy_checkAllContents = [...checkAllContents];
    
    // 올바른 형태일 때 true로 변경
    if (koreanPattern.test(data)) {
      copy_checkAllContents[0] = true;
      setCheckAllContents(copy_checkAllContents);
      dispatch(setName(data));
    }
    else {
      copy_checkAllContents[0] = false;
      setCheckAllContents(copy_checkAllContents);
    }
  }
  
  // 닉네임 중복 체크
  const nicknameIsExist = () => {
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
            // redux 저장
            dispatch(setNickname(inputNickname));

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

  // 성별 체크 확인 업데이트
  const genderIsExist = () => {
    let copy_checkAllContents = [...checkAllContents];
    copy_checkAllContents[2] = true;
    setCheckAllContents(copy_checkAllContents);
  }

  // 생일 입력 확인
  const birthIsExist = (input) => {
    let copy_checkAllContents = [...checkAllContents];
    if (input.length === 10) {
      // redux에 저장
      dispatch(setBirth(input))
  
      // 항목 확인
      copy_checkAllContents[3] = true;
    }
    else {
      copy_checkAllContents[3] = false;
    }
    setCheckAllContents(copy_checkAllContents);
  }

  // 지역 선택 확인
  const regionIsExist = (region) => {
    // redux에 저장
    dispatch(setRegion(region))
  
    // 항목 확인
    let copy_checkAllContents = [...checkAllContents];
    copy_checkAllContents[4] = true;
    setCheckAllContents(copy_checkAllContents);
  }

  // 회원가입 완료 클릭 시
  const completeSignup = () => {
    console.log('hi')
    console.log(checkAllContents)
    console.log(signupReducer)
    // 모두 true라면 회원가입 요청
    if (checkAllContents.every(item => item === true)) {
      let selectionData = {
        profileImage: "",
        mbtiCode: "",
        heightCode: "",
        drinkingCode: "",
        smokingCode: "",
        religionCode: "",
        hobbyCodeList: [],
        jobCode: "",
        personalityCodeList: [],
        introduction: "",
        styleCodeList: [],
      }
      
      let data = {
        email: signupReducer.email,
        password: signupReducer.password,
        name: signupReducer.name,
        nickname: signupReducer.nickname,
        phoneNumber: signupReducer.phonenumber,
        gender: signupReducer.gender,
        birth: signupReducer.birth,
        region: signupReducer.region,
        ...selectionData
      }
      basicHttp.post('/user/signup', data).then((response) => {
        console.log(response)
        console.log(data)
        if (response.data.code === 200) {
          alert("회원가입이 완료되었습니다.");
          Navigate("/login");
        }
        else if (response.data.code === 400) {
          alert("회원 가입 실패");
        }
      })
    }
    else {
      alert("모든 항목을 입력 또는 체크해주세요.");
      console.log(checkAllContents);
      console.log(signupReducer);
    }
  }
    

  return(
    <div>
      <p>상세정보를 입력해주세요</p>
      <input type="text" onChange={(e) => { nameIsExist(e.target.value) }} placeholder="이름"></input>
        
      <input type="text" onChange={(e) => setInputNickname(e.target.value)} placeholder="닉네임"></input>
      <button onClick={nicknameIsExist}>중복확인</button>
      <p>닉네임은 한글로만 작성해야하며, 닉네임은 중복될 수 없습니다.</p>
      
      <button onClick={() => {
        dispatch(setGender("M"));
        genderIsExist();
      }}>남</button>
      <button onClick={() => {
        dispatch(setGender("F"));
        genderIsExist();
      }}>여</button>
      <br/>

      <input type="text" onChange={(e) => birthIsExist(e.target.value)} placeholder="생년월일 8자리, 슬래시"></input>

      <h3>지역 선택</h3>
      {
        regionList.map((r,i) => {
          return (
            <button onClick={() => regionIsExist(r)}>{r}</button>
          )
        })
      }
      <br/>
      <button onClick={Navigate("/signup/selectiondata")}>추가 정보 입력하기</button>
      <button onClick={completeSignup}>로그인 하러 가기</button>
    </div>
  )
}

export default Detail