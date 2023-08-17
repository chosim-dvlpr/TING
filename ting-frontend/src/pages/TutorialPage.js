import React, { useState } from "react";
import styles from "./TutorialPage.module.css";
import NavBar from "../component/common/NavBar";
import FriendButton from "../component/common/FriendButton";
import { useSelector } from "react-redux";

function TutorialPage() {
  const userdata = useSelector((state) => state.userdataReducer.userdata);
  const [wheelHandlerActive, setWheelHandlerActive] = useState(true);

  return (
    <div className={styles.outer}>
      <NavBar />
      {userdata && (
        <FriendButton
          toggleWheelHandler={() => setWheelHandlerActive((active) => !active)}
        />
      )}
      <div className={styles.container}>
        <h1 className={styles.title}>
          <img
            className={styles.titleImg}
            src={process.env.PUBLIC_URL + "/img/돌고래.png"}
          />
          TING 사용설명서
          <img
            style={{ transform: "scaleX(-1)" }}
            className={styles.titleImg}
            src={process.env.PUBLIC_URL + "/img/돌고래.png"}
          />
        </h1>

        {/* section1 */}
        <div className={styles.section}>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_0.PNG"}
            alt="main"
          />
          <div className={styles.description}>
            <div className={styles.numberImgPink}>1</div>
            <div>
              <img
                style={{ height: "80px" }}
                src={process.env.PUBLIC_URL + "/img/tutorial/ting_button.png"}
              />{" "}
              버튼을 눌러 <br></br>매칭 대기화면에 입장하세요!
            </div>
          </div>
        </div>

        {/* section2 */}
        <div className={styles.section}>
          <div className={styles.description}>
            <div className={styles.numberImgBlue}>2</div>
            <div>
              마이크와 웹캠을 체크해주세요!
              <br />
              잔여 티켓이 있어야 <br /> 매칭을 시작할 수 있습니다.
            </div>
          </div>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_1.PNG"}
            alt="main"
          />
        </div>

        {/* section3 */}
        <div className={styles.section}>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_2.PNG"}
            alt="main"
          />
          <div className={styles.description}>
            <div className={styles.numberImgPink}>3</div>
            <div>
              매칭 시작 버튼을 누르고
              <br />
              잠시 대기해주세요.
              <br />
              팅의 알고리즘 기술로
              <br />
              당신의 인연을 찾아드릴게요!
            </div>
          </div>
        </div>

        {/* section4 */}
        <div className={styles.section}>
          <div className={styles.description}>
            <div className={styles.numberImgBlue}>4</div>
            <div>
              매칭 알림을 받으면
              <br />
              15초 안에 수락 버튼을 눌러주세요.
            </div>
          </div>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_3.PNG"}
            alt="main"
          />
        </div>

        {/* section5 */}
        <div className={styles.section}>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_5.png"}
            alt="main"
          />
          <div className={styles.description}>
            <div className={styles.numberImgPink}>5</div>
            <div>
              10개의 질문카드를 통해 <br />
              매칭 상대를 알아가 보세요!
            </div>
          </div>
        </div>

        {/* section6 */}
        <div className={styles.section}>
          <div className={styles.description}>
            <div className={styles.numberImgBlue}>6</div>
            <div>
              YES or NO
              <br />
              당신의 마지막 선택으로
              <br />
              친구 추가 여부가 결정됩니다.
            </div>
          </div>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_9.PNG"}
            alt="main"
          />
        </div>

        {/* section7 */}
        <div className={styles.section}>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_12.PNG"}
            alt="main"
          />
          <div className={styles.description}>
            <div className={styles.numberImgPink}>7</div>
            <div>
              서로를 선택한 경우 <br />
              어항에 친구 물고기가 추가되어 <br />
              채팅을 할 수 있습니다.
            </div>
          </div>
        </div>

        {/* section8 */}
        <div className={styles.section}>
          <div className={styles.description}>
            <div className={styles.numberImgBlue}>8</div>
            <div>
              채팅방에서는 상대방의 프로필과<br></br>
              채팅방 온도를 확인할 수 있습니다.
            </div>
          </div>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_13.PNG"}
            alt="main"
          />
        </div>
      </div>
    </div>
  );
}

export default TutorialPage;
