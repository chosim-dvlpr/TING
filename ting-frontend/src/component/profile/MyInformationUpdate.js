import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";

function MyInformationUpdate() {
  let Navigate = useNavigate();
  let dispatch = useDispatch();

  let userdata = useSelector((state) => state.userdataReducer.userdata);
  let [nickname, setNickname] = useState(userdata.nickname);
  let [height, setHeight] = useState(userdata.height);

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
    mbtiCode: userdata.mbtiCode, // 변경 필요
    smokingCode: userdata.smokingCode, // 변경 필요
    hobbyCodeList: userdata.hobbyCodeList, // 변경 필요
    styleCodeList: userdata.styleCodeList, // 변경 필요
    personalityCodeLIst: userdata.personalityCodeLIst, // 변경 필요
  };

  let regionList = [{regionEn: "SEOUL", regionKor: "서울"}, {regionEn: "DAEJEON", regionKor: "대전"},
  {regionEn: "BUSAN", regionKor: "부산"}, {regionEn: "DAEGU", regionKor: "대구"}, {regionEn: "INCHEON", regionKor: "인천"},
  {regionEn: "GWANGJU", regionKor: "광주"}, {regionEn: "ULSAN", regionKor: "울산"},{regionEn: "GYEONGGI", regionKor: "경기"},
  {regionEn: "GANGWON", regionKor: "강원"}, {regionEn: "CHUNGBUK", regionKor: "충북"}, {regionEn: "CHUNGNAM", regionKor: "충남"},
  {regionEn: "SEJONG", regionKor: "세종"}, {regionEn: "JEONBUK", regionKor: "전북"}, {regionEn: "JEONNAM", regionKor: "전남"},
  {regionEn: "GYEONGBUK", regionKor: "경북"}, {regionEn: "GYEONGNAM", regionKor: "경남"}, {regionEn: "JEJU", regionKor: "제주"},
]

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

      <label>MBTI</label>
      <Dropdown.Menu show>MBTI
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>
      <br/>

      <label>주량</label>
      <Dropdown.Menu show>주량
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>
      <br/>

      <label>흡연</label>
      <Dropdown.Menu show>흡연
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>
      <br/>

      <label>종교</label>
      <Dropdown.Menu show>종교
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>
      <br/>

      <label>취미</label>
      <Dropdown.Menu show>취미
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>
      <br/>
      
      <label>성격</label>
      <Dropdown.Menu show>성격
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>    
    </div>
  )
}

export default MyInformationUpdate