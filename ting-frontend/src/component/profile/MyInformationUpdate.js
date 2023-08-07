import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";
import { dataCode, drinkingCodeList, hobbyCodeList, jobCodeList, mbtiCodeList, personalityCodeList, regionList, religionCodeList, smokingCodeList } from "../../SelectionDataList";

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
// import DropdownItem from "react-bootstrap/esm/DropdownItem";
// import DropdownToggle from "react-bootstrap/esm/DropdownToggle";

function MyInformationUpdate() {
  let Navigate = useNavigate();
  let dispatch = useDispatch();

  let userdata = useSelector((state) => state.userdataReducer.userdata);
  let [nickname, setNickname] = useState(userdata.nickname);
  let [height, setHeight] = useState(userdata.height);
  let [currentMbti, setCurrentMbti] = useState(userdata.mbtiCode.name);
  let [currentDrinking, setCurrentDrinking] = useState(userdata.drinkingCode.name);
  let [currentSmoking, setCurrentSmoking] = useState(userdata.smokingCode.name);
  let [currentReligion, setCurrentReligion] = useState(userdata.religionCode.name);
  let [currentHobbyList, setCurrentHobbyList] = useState(userdata.userHobbys);
  let [currentPersonalityList, setCurrentPersonalityList] = useState(userdata.userPersonalities);
  console.log(userdata.userPersonalities)

  let newProfileData = {
    phoneNumber: userdata.phoneNumber,
    region: userdata.region,
    profileImage: userdata.profileImage,
    height: height,
    nickname: nickname,
    introduction: userdata.introduction,
    jobCode: userdata.job, // 변경 필요
    drinkingCode: userdata.drinkingCode, // 변경 필요
    religionCode: userdata.religionCode, // 변경 필요
    mbtiCode: currentMbti,
    smokingCode: userdata.smokingCode, // 변경 필요
    hobbyCodeList: userdata.hobbyCodeList, // 변경 필요
    styleCodeList: userdata.styleCodeList, // 변경 필요
    personalityCodeLIst: userdata.personalityCodeLIst, // 변경 필요
  };



  // 지역 영어를 한글로 변환
  const matchRegion = (regionData) => {
    const regionName = regionList.map((region) => region.regionEn === regionData && region.regionKor)
    return regionName
  };

  // 변경된 프로필을 DB에 저장
  const storeNewProfile = () => {
    tokenHttp.put('/user', newProfileData).then((response) => {
      console.log(response)
      if (response.data.code === 200) {
      
      }
      else if (response.data.code === 400) {
        console.log('확인 실패')
      }
      else if (response.data.code === 401) {
        console.log('로그인이 필요합니다')
      }
      else if (response.data.code === 403) {
        console.log('권한이 없습니다')
      }
    })
    .catch(() => console.log("실패"));
  };

  // 변경된 프로필을 redux에 저장
  const storeNewProfileToRedux = () => {
    dispatch(getCurrentUserdata(newProfileData));
  };

  console.log(currentHobbyList)

  return (
    <div>
      <h2>정보 수정 페이지</h2>
      <button onClick={() => {
        Navigate("/mypage");
        storeNewProfile();
      }}>저장</button>

      <p>이름 : { userdata.name }</p>
      <p>성별 : { userdata.gender }</p>
      <p>이메일 : { userdata.email }</p>
      <p>전화번호 : { userdata.phoneNumber }</p>
      <p>생년월일 : { userdata.birth }</p>
      <p>지역 : { matchRegion(userdata.region) }</p>
      <br/>

      <label>닉네임</label>
      <input 
        type="text" 
        value={ nickname }
        onChange={(e) => setNickname(e.target.value)}
      ></input>

      <label>키</label>
      <input 
        type="text" 
        value={ height }
        onChange={(e) => setHeight(e.target.value)}
      ></input>

      <p>
        <DropdownButton id="dropdown-item-button" title="MBTI">
        {dataCode
        .filter((data) => data.category.includes("MBTI"))
        .map((data, i) => 
          <Dropdown.Item key={i} as="button" onClick={() => setCurrentMbti(data.name)}>{ data.name }</Dropdown.Item>
        )
        }
        </DropdownButton>
        { currentMbti }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="주량">
        {dataCode
        .filter((data) => data.category.includes("DRINKING"))
        .map((data, i) => 
          <Dropdown.Item key={i} as="button" onClick={() => setCurrentDrinking(data.name)}>{ data.name }</Dropdown.Item>
        )
        }
        </DropdownButton>
        { currentDrinking }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="흡연">
        {dataCode
        .filter((data) => data.category.includes("SMOKING"))
        .map((data, i) => 
          <Dropdown.Item key={i} as="button" onClick={() => setCurrentSmoking(data.name)}>{ data.name }</Dropdown.Item>
        )
        }
        </DropdownButton>
        { currentSmoking }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="종교">
        {dataCode
        .filter((data) => data.category.includes("RELIGION"))
        .map((data, i) => 
          <Dropdown.Item key={i} as="button" onClick={() => setCurrentReligion(data.name)}>{ data.name }</Dropdown.Item>
        )
        }
        </DropdownButton>
        { currentReligion }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="취미">
        {dataCode
        .filter((data) => data.category.includes("HOBBY"))
        .map((data, i) => 
          { let addData = {
            code: data.code,
            category: data.category,
            name: data.name
          }
          return (
            <Dropdown.Item key={i} as="button" onClick={() => setCurrentHobbyList([...currentHobbyList, addData])}>{ data.name }</Dropdown.Item>
          )
          }
        )
        }
        </DropdownButton>
        { currentHobbyList.map((hobby, i) => (
          hobby.name
        )) }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="성격">
        {dataCode
        .filter((data) => data.category.includes("PERSONALITY"))
        .map((data, i) => 
          { let addData = {
            code: data.code,
            category: data.category,
            name: data.name
          }
          return (
            <Dropdown.Item key={i} as="button" onClick={() => setCurrentPersonalityList([...currentPersonalityList, addData])}>{ data.name }</Dropdown.Item>
          )
          }
        )
        }
        </DropdownButton>
        { currentPersonalityList.map((personality, i) => (
          personality.name
        )) }
      </p>
      <br/>

    </div>
  )
}

export default MyInformationUpdate