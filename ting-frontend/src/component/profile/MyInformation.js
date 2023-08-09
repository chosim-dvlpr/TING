import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { regionList } from "../../SelectionDataList";

import commonStyles from "./ProfileCommon.module.css";
import styles from "./MyInformation.module.css";

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
    <div className={commonStyles.wrapper}>
      <div className={styles.btnWrapper}>
        <button className={commonStyles.btn} onClick={() => Navigate("/mypage/update")}>수정하기</button>
      </div>

      <div className={styles.innerWrapper}>
        <table>
          <tr><th className={styles.title}>이름</th> <td>{userdata.name}</td></tr>
          <tr><th className={styles.title}>성별</th> <td>{userdata.gender === "F" ? "여성" : "남성"}</td></tr>
          <tr><th className={styles.title}>이메일</th> <td>{userdata.email}</td></tr>
          <tr><th className={styles.title}>전화번호</th> <td>{userdata.phoneNumber}</td></tr>
          <tr><th className={styles.title}>생년월일</th> <td>{userdata.birth}</td></tr>
          <tr><th className={styles.title}>지역</th> <td>{englishPattern.test(userdata.region) ? matchRegion(userdata.region) : userdata.region}</td></tr>
        </table>
      </div>
      <hr />

      <div className={styles.innerWrapper}>
        {/* <p>닉네임 : { userdata.nickname }</p> */}
        <table id={styles.moreInfo}>
          <tr>
            <th className={styles.title}>키</th>
            <td>{userdata.height}</td>
          </tr>
          <tr>
            <th className={styles.title}>MBTI</th>
            <td>{userdata.mbtiCode && userdata.mbtiCode.name}</td>
          </tr>
          <tr>
            <th className={styles.title}>주량</th>
            <td>{userdata.drinkingCode && userdata.drinkingCode.name}</td>
          </tr>
          <tr>
            <th className={styles.title}>흡연</th>
            <td>{userdata.smokingCode && userdata.smokingCode.name}</td>
          </tr>
          <tr>
            <th className={styles.title}>종교</th>
            <td>{userdata.religionCode && userdata.religionCode.name}</td>
          </tr>
          <tr>
            <th className={styles.title}>직업</th>
            <td>{userdata.jobCode && userdata.jobCode.name}</td>
          </tr>
        </table>
        <table className={styles.moreInfo}>
          <tr>
            <th className={styles.title}>취미</th>
            <td className={styles.hashtag}>
              {userdata.userHobbys &&
                userdata.userHobbys.map((hobby) => <span>#{hobby.name}</span>)}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>성격</th>
            <td className={styles.hashtag}>
              {userdata.userPersonalities &&
                userdata.userPersonalities.map((personalities) => <span>#{personalities.name}</span>)}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>선호 스타일</th>
            <td className={styles.hashtag}>
              {userdata.userStyles &&
                userdata.userStyles.map((styles) => <span>#{styles.name}</span>)}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>자기소개</th>
            <td>{userdata.introduce !== "" ?
              userdata.introduce
              : '자기소개가 없어요!'
            }</td>
          </tr>
        </table>
      </div>
    </div>
  )
}

export default MyInformation