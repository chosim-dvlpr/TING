import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { religionCodeList } from "../../SelectionDataList";

function MyInformation() {
  let Navigate = useNavigate();

  let userdata = useSelector((state) => state.userdataReducer.userdata);

  // 지역 영어를 한글로 변환
  const matchRegion = (regionData) => {
    const regionName = religionCodeList.map((region) => region.regionEn === regionData && region.regionKor)
    return regionName
  };

  return (
    <div>
      <h2>내 정보 페이지</h2>
      <button onClick={() => Navigate("/mypage/update")}>편집</button>

      <p>이름 : { userdata.name }</p>
      <p>성별 : { userdata.gender }</p>
      <p>이메일 : { userdata.email }</p>
      <p>전화번호 : { userdata.phoneNumber }</p>
      <p>생년월일 : { userdata.birth }</p>
      <p>지역 : { matchRegion(userdata.region) }</p>
      <br/>
      <p>닉네임 : { userdata.nickname }</p>
      <p>키 : { userdata.height }</p>
      <p>MBTI : { userdata.mbtiCode.name }</p>
      <p>주량 : { userdata.drinkingCode.name }</p>
      <p>흡연 : { userdata.smokingCode.name }</p>
      <p>종교 : { userdata.religionCode.name }</p>
      <p>직업 : { userdata.jobCode.name }</p>
      <br/>
      <p>취미 : { userdata.userHobbys.map((hobby) => hobby.name) }</p>
      <br/>
      <p>성격 : { userdata.userPersonalities.map((personalities) => personalities.name) }</p>
    </div>
  )
}

export default MyInformation