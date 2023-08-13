import { Outlet } from "react-router-dom"
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
import { setDrinkingCode, setHeightCode, setHobbyCodeList, setMbtiCode, setPersonalityCodeList, setReligionCode, setSmokingCode, setStyleCodeList } from "../../redux/signup"
import { dataCode } from "../../SelectionDataList"
import { useEffect, useState } from "react"

function SelectionData(){
  
  let dispatch = useDispatch();
  let signupReducer = useSelector((state) => state.signupReducer);
  const signupReducerKeys = Object.keys(signupReducer);

  const dataCodeCategory = Object.values(dataCode);
  const dataCodeCategorySet = new Set();
  const [dataCodeCategoryList, setDataCodeCategoryList] = useState([]);
  
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

  // 드롭다운 리스트
  const contentsList = (category) => {
    return (dataCode
      .filter((data) => data.category.includes(category))
      .map((data, i) => (
        <Dropdown.Item onClick={() => {
          console.log(data)
          // handleDropdownItemClick(data)
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


  return(
    <div>
      <h3>추가 정보 입력</h3>
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
            onChange={(e) => changeHeight(e.target.value)}
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

          {/* <Hobby />
          <Personality />
          <Style />
          <Introduce />
          <ProfileImage /> */}
        </div>
      </div>
    </div>
  )
}

export default SelectionData