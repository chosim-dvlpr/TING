import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { regionList } from "../../SelectionDataList";

function MyInformation() {
  let Navigate = useNavigate();

  let userdata = useSelector((state) => state.userdataReducer.userdata);
  const englishPattern = /^[A-Za-z]+$/;

  // 지역 영어를 한글로 변환
  const matchRegion = (regionData) => {
    const regionName = regionList.filter((region) => region.regionEn === regionData ? region.regionKor : null)[0].regionKor
    console.log(regionName)
    return regionName
  };

  console.log(userdata)



  return (
    <div>
      <h2>내 정보 페이지</h2>
      <button onClick={() => Navigate("/mypage/update")}>편집</button>

      <p>이름 : { userdata.name }</p>
      <p>성별 : { userdata.gender === "F" ? "여성" : "남성" }</p>
      <p>이메일 : { userdata.email }</p>
      <p>전화번호 : { userdata.phoneNumber }</p>
      <p>생년월일 : { userdata.birth }</p>
      <p>지역 : { englishPattern.test(userdata.region) ? matchRegion(userdata.region) : userdata.region }</p>
      <br/>
      <p>닉네임 : { userdata.nickname }</p>
      <p>키 : { userdata.height }</p>
      <p>MBTI : { userdata.mbtiCode && userdata.mbtiCode.name }</p>
      <p>주량 : { userdata.drinkingCode && userdata.drinkingCode.name }</p>
      <p>흡연 : { userdata.smokingCode && userdata.smokingCode.name }</p>
      <p>종교 : { userdata.religionCode && userdata.religionCode.name }</p>
      <p>직업 : { userdata.jobCode && userdata.jobCode.name }</p>
      <br/>
      <p>취미 : { userdata.userHobbys && userdata.userHobbys.map((hobby) => hobby.name) }</p>
      <br/>
      <p>성격 : { userdata.userPersonalities && userdata.userPersonalities.map((personalities) => personalities.name) }</p>
    </div>
  )
}

export default MyInformation