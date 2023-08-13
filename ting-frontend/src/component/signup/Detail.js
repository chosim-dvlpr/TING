import { useNavigate } from "react-router-dom"
import { useCallback, useState, forwardRef, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import basicHttp from '../../api/basicHttp';
import { setGender, setName, setRegion, setBirth, setNickname, completeSignupStep } from '../../redux/signup';
import { regionList } from "../../SelectionDataList";

import styles from './SignupCommon.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function Detail() {
  const Navigate = useNavigate();
  // let [inputName, setInputName] = useState("");
  let [inputNickname, setInputNickname] = useState("");
  let inputNicknameRef = useRef();
  let [checkNickname, setCheckNickname] = useState(false);
  const [nicknameMsg, setNicknameMsg] = useState("");
  let [currentRegion, setCurrentRegion] = useState("");
  let allContentsNum = 5;
  let [checkAllContents, setCheckAllContents] = useState([false, false, false, false, false]); // 리스트 하드코딩 수정하기
  let [count, setCount] = useState(0);
  const [genderSelected, setGenderSelected] = useState();

  // 생년월일
  const [birthDate, setBirthDate] = useState("");

  let dispatch = useDispatch();
  let signupReducer = useSelector((state) => state.signupReducer);

  // 항목 입력 체크
  // let [region, setRegion] = useState("");

  // 한글만 허용하는 패턴
  const koreanPattern = /^[가-힣]*$/;
  const koreanPatternAll = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]*[ㄱ-ㅎㅏ-ㅣ가-힣]+[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]*$/


  // 이름 작성 확인
  const nameIsExist = (data) => {
    let copy_checkAllContents = [...checkAllContents];
    
    // 올바른 형태일 때 true로 변경
    if (koreanPattern.test(data)) {
      dispatch(setName(data)); // redux 저장
    }
    else {
      dispatch(setName(null));
    }
  }
  
  // 닉네임 중복 체크
  const nicknameIsExist = () => {
    // 닉네임 한글 확인
    // 한글이 아닌 글자가 있다면 경고메세지 출력
    if (!koreanPattern.test(inputNickname)) {
      alert("한글만 입력 가능합니다.");
    }
    else {
      basicHttp.get(`/user/nickname/${inputNickname}`).then((response) => {
        if (response.data.code === 200) {
          // 닉네임 중복 시
          if (response.data.data === true) {
            alert("닉네임이 중복되었습니다.\n다시 작성해주세요.")
            dispatch(setNickname(null));
            return
          }
          else {
            alert("닉네임 사용이 가능합니다.");
            setCheckNickname(true);
            // redux 저장
            dispatch(setNickname(inputNickname));
            return
          }
        }
        else if (response.data.code === 400) {
          console.log('400 error');
        }
      })
      .catch(() => console.log("실패"));
    }
  }

  // 생일 입력 시
  const handleBirthChange = (selectedBirth) => {
    setBirth(selectedBirth)
    dispatch(setBirth(selectedBirth)); // Redux 상태에 저장
  }

  // useEffect(() => {
  //   checkAdult();
  // }, [handleBirthChange])

  const checkAdult = () => {
    const year = signupReducer.birth && signupReducer.birth.slice(0,4);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    // console.log(currentYear)

    if (signupReducer.birth &&
        currentYear - Number(year) < 19) {
      alert("성인만 회원가입 가능합니다.");
      setBirth(null);
      return false
    }
    else {return true}
  }

  // 지역 선택 시
  const handleRegionChange = (selectedRegion) => {
    setCurrentRegion(selectedRegion)
  }

  useEffect(() => {
    dispatch(setRegion(currentRegion.regionEn)); // Redux 상태에 저장
  }, [currentRegion])

  useEffect(() => {
    if (inputNickname && !koreanPatternAll.test(inputNickname)) {
      setNicknameMsg("한글만 입력 가능합니다.")
      // inputNicknameRef.current.value = "";
    }
  }, [inputNickname])

  // 엔터키로 버튼 누를 수 있게
  const activeEnter = (e, check) => {
    if(e.key === "Enter") {
      switch (check) {
        case nicknameIsExist:
          nicknameIsExist();
          break;
      }
    }
  }
  
  // 모든 항목이 입력되었다면 true 반환
  const checkAllData = () => {
    const checkDataList = ["email", "password", "phoneNumber", "name", 
      "nickname", "gender", "birth", "region"];
      let count = 0;

    checkDataList.forEach((data) => {
      if (!signupReducer[data]) { // 빈 값이 있다면 1 추가
        count++;
      }
    })

    // 빈 값이 있다면
    if (count > 0) {
      return false
    }
    else {
      return true
    }
  }

  // 회원가입 완료 클릭 시
  const goToSignupComplete = (moveTo) => {
    // 모두 값이 있다면 회원가입 요청
    console.log(checkAllData())
    // console.log(checkAdult())
    if (!checkAllData()) {
      alert("모든 항목을 입력 또는 체크해주세요.");
    }
    else if (!checkAdult()) {
      alert("성인만 회원가입 가능합니다.");
    }
    else {Navigate(moveTo)}
  }

  return(
    <div className={styles.wrapper}>
      {/* <label>이름을 입력해주세요</label> */}
      <div className={styles.nameContainer}>
        <input 
          className={styles.input} 
          id={styles.nameInput} 
          type="text" 
          onChange={(e) => { nameIsExist(e.target.value) }} 
          placeholder="이름"></input>
        <div>
          <input 
            className={styles.input}
            ref={inputNicknameRef} 
            type="text" 
            onChange={(e) => setInputNickname(e.target.value)}
            onKeyDown={(e) => activeEnter(e, nicknameIsExist)}
            placeholder="닉네임"></input>
          <button 
            className={styles.btn} 
            onClick={() => nicknameIsExist()}>
          중복확인</button>
          <p>닉네임은 한글로만 작성해야하며, 닉네임은 중복될 수 없습니다.</p>
          <p className={styles.wrongMsg}>{ nicknameMsg }</p>
          <p className={styles.rightMsg}>
            {
              checkNickname &&
              "닉네임 중복 확인 완료"
            }
          </p>
        </div>
      </div>
      <button
        className={`${styles.selectBtn} ${styles.genderBtn} ${genderSelected === "M" && styles.genderSelected}`} 
        onClick={() => {
          dispatch(setGender("M"));
          setGenderSelected("M");
      }}>남</button>
      <button
        className={`${styles.selectBtn} ${styles.genderBtn} ${genderSelected === "F" && styles.genderSelected}`} 
        onClick={() => {
          dispatch(setGender("F"));
          setGenderSelected("F");
      }}>여</button>
      <br/>

      <label>생년월일</label>
      <input 
        type="date" 
        onChange={(e) => {
          handleBirthChange(e.target.value)
        }}
        max="2004-12-31"
        ></input>
      <br/>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          지역 선택
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            regionList.map((r, i) => (
              <Dropdown.Item onClick={() => {
                handleRegionChange(r)
                // setCurrentRegion(r.regionEn);
                // dispatch(setRegion(currentRegion));
              }
                }>{r.regionKor}</Dropdown.Item>
              )
            )
          }
        </Dropdown.Menu>
      </Dropdown>
      <p>{ currentRegion.regionKor }</p>
      <br/>
      {/* <label>추가 정보를 입력하시면 매칭 정확도가 올라가요!</label> */}
      <button className={styles.btn} onClick={() => goToSignupComplete("/signup/complete")}>다음</button>
      {/* <br/>
      <label>추가 정보 입력하지 않고 완료할게요!</label>
      <button className={styles.btn} onClick={() => completeSignup("/signup/complete")}>회원가입 완료</button> */}
    </div>
  )
}

export default Detail