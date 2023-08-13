import { Outlet, useNavigate } from "react-router-dom"
import Mbti from "./select/Mbti"
import Height from "./select/Height"
import Drink from "./select/Drink"
import Smoke from "./select/Smoke"
import Religion from "./select/Religion"
import Job from "./select/Job"
import Hobby from "./select/Hobby"
import Personality from "./select/Personality"
import Style from "./select/Style"
import Introduce from "./select/Introduce"
import ProfileImage from "./select/profileImage"
import styles from './SignupCommon.module.css'

import { useDispatch, useSelector } from "react-redux";
import Dropdown from 'react-bootstrap/Dropdown';
import { completeSignupStep, setDrinkingCode, setHeightCode, setHobbyCodeList, setIntroduce, setMbtiCode, setPersonalityCodeList, setReligionCode, setSmokingCode, setStyleCodeList } from "../../redux/signup"
import { dataCode } from "../../SelectionDataList"
import { useEffect, useRef, useState } from "react"
import fileHttp from "../../api/fileHttp"
import basicHttp from "../../api/basicHttp"

function SelectionData(){
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let signupReducer = useSelector((state) => state.signupReducer);
  const signupReducerKeys = Object.keys(signupReducer);

  const dataCodeCategory = Object.values(dataCode);
  const dataCodeCategorySet = new Set();
  const [dataCodeCategoryList, setDataCodeCategoryList] = useState([]);
  
  
  const email = signupReducer.email;
  const password = signupReducer.password;
  const formData = new FormData();

  const userHeight = useRef();

  const getDataCodeCategory = () => {
    dataCodeCategory.forEach((data) => 
    dataCodeCategorySet.add(data.category));

    const categoryList = Array.from(dataCodeCategorySet); // Set을 배열로 변환
    setDataCodeCategoryList(categoryList); // 리스트로 변경
  }
  
  useEffect(() => {
    getDataCodeCategory();
  }, [])  

  const handleDropdownItemClick = (data) => {
    switch (data.category) {
      case "MBTI":
        dispatch(setMbtiCode(data));
        break;
      case "DRINKING":
        dispatch(setDrinkingCode(data));
        break;
      case "SMOKING":
        dispatch(setSmokingCode(data));
        break;
      case "RELIGION":
        dispatch(setReligionCode(data));
        break;
      case "HOBBY":
        dispatch(setHobbyCodeList(data));
        break;
      case "PERSONALITY":
        dispatch(setPersonalityCodeList(data));
        break;
      case "STYLE":
        dispatch(setStyleCodeList(data));
        break;
    }
  };

  // 드롭다운
  const contents = (category) => {
    return (dataCode
      .filter((data) => data.category.includes(category))
      .map((data, i) => (
        <Dropdown.Item onClick={() => {
          handleDropdownItemClick(data)
          }}
          key={i}
        >{ data.name }</Dropdown.Item>
      )))
  };

  // 키 저장
  const changeHeight = (height) => {
    if (height > 100 & height < 250) {
      dispatch(setHeightCode(Number(height)));
    };
  };


  // 파일 업로드
  // 업로드된 이미지 보낼 때 이메일, 비밀번호 함께 보내기 (유저 확인)
  const onUploadImage = (e) => {
    e.preventDefault();

    if (!e.target.files) {
      return;
    }

    formData.append('file', e.target.files[0]);
    formData.append("email", email);
    formData.append("password", password);
  }

  // 파일 api 보내기
  const sendProfileImage = () => {
    fileHttp.post("/user/profile/noToken", formData).then((response) => {
      console.log(response);
      if (response.data.code === 200) {
        return true
      }
      else {
        console.log('파일 업로드 실패')
        return false
      }
    });
  }

  // 로그인 버튼 클릭 시 데이터 보내기
  const goToLogin = (MoveTo) => {
    if (signupReducer.heightCode && 
        signupReducer.heightCode < 120 | signupReducer.heightCode > 250) {
          alert("올바른 키를 입력해주세요.\n100에서 250 사이의 키만 입력 가능합니다.");
          userHeight.current.value = "";
          return
        }
    else {
      basicHttp.post('/user/signup', signupReducer).then((response) => {
        if (response.data.code === 200) {
          if (sendProfileImage()) {
            alert("회원가입이 완료되었습니다.");
            dispatch(completeSignupStep());
            navigate(MoveTo);
          }
          else {
            alert("프로필 사진 업로드에 실패했습니다.")
          }
        }
        else if (response.data.code === 400) {
          alert("회원 가입 실패\n정확한 정보를 입력해주세요.");
        }
      })
      .catch(() => alert("회원가입 실패"))
    }
  };


  return(
    <div>
      <h3>추가 정보를 입력해주세요!</h3>
      {/* <Outlet></Outlet> */}
      <div className={styles.selectDataContainer}>
        <div>
          <h3>MBTI</h3>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
            { signupReducer.mbtiCode ? signupReducer.mbtiCode.name : "MBTI" }
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {
                contents("MBTI")
              }
            </Dropdown.Menu>
          </Dropdown>

          <h3>Drinking</h3>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
            { signupReducer.drinkingCode ? signupReducer.drinkingCode.name : "주량" }
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {
                contents("DRINKING")
              }
            </Dropdown.Menu>
          </Dropdown>
          
          <h3>Smoking</h3>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
            { signupReducer.smokingCode ? signupReducer.smokingCode.name : "흡연" }
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {
                contents("SMOKING")
              }
            </Dropdown.Menu>
          </Dropdown>

          <h3>Religion</h3>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
            { signupReducer.religionCode ? signupReducer.religionCode.name : "종교" }
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {
                contents("RELIGION")
              }
            </Dropdown.Menu>
          </Dropdown>

          <h3>Height</h3>
          <input 
            ref={userHeight}
            onChange={(e) => dispatch(setHeightCode(Number(e.target.value)))}
            type="number" min="100" max="250"></input> 
        </div>

        <div>
        <h3>Hobby</h3>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
          { "취미" }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {
              contents("HOBBY")
            }
          </Dropdown.Menu>
        </Dropdown>
        <span>
        {
          signupReducer.hobbyCodeList.map((hobby, i) => (
            <p>{ hobby.name }</p>
          ))
        }
        </span>

        <h3>Personality</h3>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
          { "성격" }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {
              contents("PERSONALITY")
            }
          </Dropdown.Menu>
        </Dropdown>
        <span>
        {
          signupReducer.personalityCodeList.map((personality, i) => (
            <p>{ personality.name }</p>
          ))
        }
        </span>

        <h3>Style</h3>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
          { "선호 스타일" }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {
              contents("STYLE")
            }
          </Dropdown.Menu>
        </Dropdown>
        <span>
        {
          signupReducer.styleCodeList.map((style, i) => (
            <p>{ style.name }</p>
          ))
        }
        </span>
        <h4>자신을 간단하게 소개해주세요</h4>
        <input type="text" onChange={(e) => dispatch(setIntroduce(e.target.value))}></input>
        
        <div>
          <h4>프로필 사진을 업로드해주세요</h4>
          <input type="file" accept='image/*' onChange={onUploadImage}></input>
        </div>

          {/* <Hobby />
          <Personality />
          <Style />
          <Introduce />
          <ProfileImage /> */}
        </div>
      </div>
      
      <div>
          <button 
            onClick={() => goToLogin("/login")}
            className={styles.btn}  
          >로그인 하러 가기</button>
      </div>
    </div>
  )
}

export default SelectionData