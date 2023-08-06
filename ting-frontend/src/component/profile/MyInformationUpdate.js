import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Dropdown from "react-bootstrap/Dropdown";

function MyInformationUpdate() {
  let Navigate = useNavigate();

  let userdata = useSelector((state) => state.userdataReducer.userdata);
  let [nickname, setNickname] = useState(userdata.nickname);
  let [height, setHeight] = useState(userdata.height);

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

  return (
    <div>
      <h2>정보 수정 페이지</h2>
      <button onClick={() => 
        Navigate("/mypage")}>저장</button>

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

      <label>주량</label>
      <Dropdown.Menu show>주량
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>

      <label>흡연</label>
      <Dropdown.Menu show>흡연
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>

      <label>종교</label>
      <Dropdown.Menu show>종교
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>

      <label>취미</label>
      <Dropdown.Menu show>취미
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>

      <Dropdown.Menu show>성격
        <Dropdown.Item eventKey="1">임시1</Dropdown.Item>
        <Dropdown.Item eventKey="2">임시2</Dropdown.Item>
      </Dropdown.Menu>    
    </div>
  )
}

export default MyInformationUpdate