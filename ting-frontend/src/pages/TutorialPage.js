import styles from "./TutorialPage.module.css";
import NavBar from "../component/common/NavBar";

function TutorialPage() {
  return (
    <div className={styles.outer}>
      <NavBar />
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
            <div className={styles.numberImg}>1</div>
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
            <div className={styles.numberImg}>2</div>
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
        <div className={styles.bigImgSection}>
          <div className={styles.description}>
            <div className={styles.numberImg}>3</div>
            <div>
              매칭 시작 버튼을 누르고
              <br />
              잠시 대기해주세요!
              <br />
              팅의 알고리즘 기술로
              <br />
              당신의 인연을 찾아드릴게요!
            </div>
          </div>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_2.PNG"}
            alt="main"
          />
        </div>

        {/* section4 */}
        <div className={styles.section}>
          <img
            className={styles.img}
            src={process.env.PUBLIC_URL + "/img/tutorial/tutorial_3.PNG"}
            alt="main"
          />
          <div className={styles.description}>
            <div className={styles.numberImg}>4</div>
            <div>
              매칭 알림을 받으면
              <br />
              15초 안에 수락 버튼을 눌러주세요
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialPage;
