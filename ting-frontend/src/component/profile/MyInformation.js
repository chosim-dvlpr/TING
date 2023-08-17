import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { regionList } from "../../SelectionDataList";

import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";

import commonStyles from "./ProfileCommon.module.css";
import styles from "./MyInformation.module.css";

function MyInformation() {
  let Navigate = useNavigate();
  let dispatch = useDispatch();

  let userdata = useSelector((state) => state.userdataReducer.userdata);
  const englishPattern = /^[A-Za-z]+$/;

  useEffect(() => {
    // 유저 데이터 redux에 저장
    tokenHttp.get("/user").then((response) => {
      dispatch(getCurrentUserdata(response.data.data));
      localStorage.setItem("userId", response.data.data.userId);
    });
  }, []);

  // 지역 영어를 한글로 변환
  const matchRegion = (regionData) => {
    const matchingRegion = regionList.find(
      (region) => region.regionEn === regionData
    );
    if (matchingRegion) {
      return matchingRegion.regionKor;
    } else {
      return regionData; // 일치하는 지역 정보가 없을 경우 원래 regionData 반환
    }
  };

  return (
    <div className={commonStyles.wrapper}>
      <div className={styles.btnWrapper}>
        <button
          className={commonStyles.btn}
          onClick={() => Navigate("/mypage/update")}
        >
          수정하기
        </button>
      </div>

      <div className={styles.innerWrapper}>
        <table>
          <tr>
            <th className={styles.title}>이름</th>{" "}
            <td>
              <div>{userdata.name}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>성별</th>{" "}
            <td>
              <div>{userdata.gender === "F" ? "여성" : "남성"}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>이메일</th>{" "}
            <td>
              <div>{userdata.email}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>전화번호</th>{" "}
            <td>
              <div>{userdata.phoneNumber}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>생년월일</th>{" "}
            <td>
              <div>{userdata.birth}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>지역</th>{" "}
            <td>
              <div>
                {englishPattern.test(userdata.region)
                  ? matchRegion(userdata.region)
                  : userdata.region}
              </div>
            </td>
          </tr>
        </table>
      </div>
      <hr />

      <div className={styles.innerWrapper}>
        {/* <p>닉네임 : { userdata.nickname }</p> */}
        <table id={styles.moreInfo}>
          <tr>
            <th className={styles.title}>키</th>
            <td>
              <div>{userdata.height}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>MBTI</th>
            <td>
              {userdata.mbtiCode ? (
                <div>{userdata.mbtiCode && userdata.mbtiCode.name}</div>
              ) : (
                <div className={styles.noData}>입력안함</div>
              )}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>음주</th>
            <td>
              {userdata.drinkingCode ? (
                <div>{userdata.drinkingCode && userdata.drinkingCode.name}</div>
              ) : (
                <div className={styles.noData}>입력안함</div>
              )}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>흡연</th>
            <td>
              {userdata.smokingCode ? (
                <div>{userdata.smokingCode && userdata.smokingCode.name}</div>
              ) : (
                <div className={styles.noData}>입력안함</div>
              )}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>종교</th>
            <td>
              {userdata.religionCode ? (
                <div>{userdata.religionCode.name}</div>
              ) : (
                <div className={styles.noData}>입력안함</div>
              )}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>직업</th>
            <td>
              {userdata.jobCode ? (
                <div>{userdata.jobCode.name}</div>
              ) : (
                <div className={styles.noData}>입력안함</div>
              )}
            </td>
          </tr>
        </table>
        <table className={styles.moreInfo}>
          <tr>
            <th className={styles.title}>취미</th>
            <td className={styles.hashtag}>
              {userdata.userHobbys.length > 0 ? (
                <div>
                  {userdata.userHobbys &&
                    userdata.userHobbys.map((hobby) => (
                      <span>#{hobby.name}</span>
                    ))}
                </div>
              ) : (
                <div className={styles.noData}>입력안함</div>
              )}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>성격</th>
            <td className={styles.hashtag}>
              {userdata.userPersonalities.length > 0 ? (
                <div>
                  {userdata.userPersonalities.map((personalities) => (
                    <span>#{personalities.name}</span>
                  ))}
                </div>
              ) : (
                <div className={styles.noData}>입력안함</div>
              )}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>선호 스타일</th>
            <td className={styles.hashtag}>
              {userdata.userStyles.length > 0 ? (
                <div>
                  {userdata.userStyles.map((styles) => (
                    <span>#{styles.name}</span>
                  ))}
                </div>
              ) : (
                <div className={styles.noData}>입력안함</div>
              )}
            </td>
          </tr>
          <tr>
            <th className={styles.title}>자기소개</th>
            <td>
              {userdata.introduce !== "" ? (
                <div>{userdata.introduce}</div>
              ) : (
                <div className={styles.noData}>입력안함</div>
              )}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default MyInformation;
