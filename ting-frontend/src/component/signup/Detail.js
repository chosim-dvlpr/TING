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
  const [genderSelected, setGenderSelected] = useState();

  let dispatch = useDispatch();
  let signupReducer = useSelector((state) => state.signupReducer);

  // 한글만 허용하는 패턴
  const koreanPattern = /^[가-힣]*$/;
  const koreanPatternAll = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]*[ㄱ-ㅎㅏ-ㅣ가-힣]+[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]*$/

  const [showNicknameMessage, setShowNicknameMessage] = useState(false);

  // 이름 작성 확인
  const nameIsExist = (data) => {
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
            setShowNicknameMessage(false);
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
    dispatch(setBirth(selectedBirth)); // Redux 상태에 저장
  }

  const checkAdult = () => {
    let year = signupReducer.birth && signupReducer.birth.slice(0,4);
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();

    if (signupReducer.birth &&
        currentYear - Number(year) < 19) {
      alert("성인만 회원가입 가능합니다.");
      dispatch(setBirth(null));
      return false
    }
    else {return true}
  }

  // 지역 선택 시
  const handleRegionChange = (selectedRegion) => {
    setCurrentRegion(selectedRegion)
  }

  useEffect(() => {
    dispatch(setRegion(currentRegion.regionKor)); // Redux 상태에 저장
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
          setShowNicknameMessage(false);
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
    // console.log(checkAllData())
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
        {/* <div className={styles.wrapper}> */}
          <input 
            className={styles.input} 
            id={styles.nameInput} 
            type="text" 
            onChange={(e) => { nameIsExist(e.target.value) }} 
            placeholder="이름"></input>
        {/* </div> */}
        <div className={styles.wrapper}>
          <div className={styles.inputContainer}>
            {/* <p className={styles.label}>닉네임은 한글로만 작성해야하며, 중복될 수 없습니다.</p> */}
            <input 
              className={`${styles.input} ${styles.nicknameInput}`}
              ref={inputNicknameRef} 
              type="text" 
              onChange={(e) => setInputNickname(e.target.value)}
              onKeyDown={(e) => activeEnter(e, nicknameIsExist)}
              placeholder="닉네임"
              onFocus={() => setShowNicknameMessage(true)}
              onBlur={() => {
                setShowNicknameMessage(false);
                inputNicknameRef.current.blur();
              }}
              disabled={checkNickname}
            ></input>
          <button 
            className={checkNickname ? styles.disabledBtn : styles.btn} 
            onClick={() => nicknameIsExist()}>
          중복확인</button>
          {showNicknameMessage && (
              <div className={`${styles.nicknameMessage}`}>
                닉네임은 한글로만 작성해야하며, 중복될 수 없습니다.
              </div>
            )}
        </div>
          {/* <p className={styles.wrongMsg}>{ nicknameMsg }</p> */}
          <p 
          className={styles.rightMsg}
          >
            {
              checkNickname &&
              "닉네임 중복 확인 완료"
            }
          </p>
        </div>
      </div>

      <div className={`${styles.wrapper} ${styles.flexContainer}`}>
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
      </div>

      <div className={styles.wrapper}>
        <label
        className={`${styles.label} ${styles.birthLabel}`}
        >생년월일</label>
        <input 
          className={styles.input}
          type="date" 
          onChange={(e) => {
            handleBirthChange(e.target.value)
          }}
          max="2004-12-31"
          ></input>
      </div>

      <div className={styles.wrapper}>
        <Dropdown>
          <Dropdown.Toggle 
          className={`${styles.btn} ${styles.regionBtn}`}
          id="dropdown-basic">
            { currentRegion.regionKor ? currentRegion.regionKor : "지역 선택"}
          </Dropdown.Toggle>
          <Dropdown.Menu
          className={styles.regionList}
          >
            {
              regionList.map((r, i) => (
                <Dropdown.Item 
                className={styles.dropdownItem}
                key={i}   
                onClick={() => {
                  handleRegionChange(r)
                }}
                // active={currentRegion.regionEn === r.regionEn}
                >{r.regionKor}</Dropdown.Item>
                )
              )
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {/* <label>추가 정보를 입력하시면 매칭 정확도가 올라가요!</label> */}
      <div className={styles.nextContainer}>
        <button 
          className={`${styles.btn} ${styles.nextBtn}`} 
          onClick={() => goToSignupComplete("/signup/complete")}
        >다음</button>
      </div>
      {/* <br/>
      <label>추가 정보 입력하지 않고 완료할게요!</label>
      <button className={styles.btn} onClick={() => completeSignup("/signup/complete")}>회원가입 완료</button> */}
    </div>
  )
}

export default Detail