import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";

import AOS from "aos";
import "./aos.css";

import styles from "./MainPage.module.css";

//component
import CountdownTimer from "../component/main/CountdownTimer";
import MainButton from "../component/main/MainButton";

function MainPage() {
  

  useEffect(() => {
    AOS.init();
    return () => {
      AOS.refresh(); // 컴포넌트가 언마운트될 때 AOS를 해제
    };
  }, []);

  return (
    <div>
            {/*section1 */}
            <div className={styles.backgroundFish} id={styles.backgroundFish1}>
        <img src="/img/fish_group_1.png"></img>
      </div>
      <div className={styles.backgroundFish} id={styles.backgroundFish2}>
        <img src="/img/fish_group_2.png"></img>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.section1textbox}>
          <h1>5분 <span id={styles.textDeco}>팅!! </span>으로<br></br>사랑을 찾아봐</h1>
        </div>
        <div className={styles.section1imgbox}>
          <Link to="/matching" className={styles.linkButton}>
            <img src="/img/heart_1.png" alt="main" className={styles.img}></img>
          </Link>
        </div>
      </div>

      {/*section2 */}
      <div
        data-aos="fade-down"
        data-aos-duration="1000"
        className={styles.wrapper}
      >
        <img
          src="/img/watch.png"
          alt="watch"
          className={styles.section2imgbox}
        ></img>

        
        <div className={styles.section2textbox}>
        <CountdownTimer />
          <h1>
            5분 동안 어떤 일을<br></br>할 수 있을까요?</h1>
        </div>
      </div>

      {/*section3 */}
      <div
        data-aos="fade-down"
        data-aos-duration="1000"
        className={styles.wrapper}
      >
        <img
          src="/img/cards_front.png"
          alt="cards_front"
          className={styles.section3imgbox1}
        ></img>
        <img
          src="/img/cards_left.png"
          alt="cards_left"
          className={styles.section3imgbox2}
        ></img>
         <div className={styles.section2textbox}>
        <h1>
          팅에서는
          <br />
          5분 안에
          <br />
          상대의 취미부터 취향까지
          <br />
          바로 확인 할 수 있습니다
        </h1>
        </div>
      </div>

      {/*section4 */}

      <div
        data-aos="fade-down"
        data-aos-duration="1000"
        className={styles.wrapper}
      >
        <div className={styles.section2textbox}>
        <h1>
          5분 후<br />
          상대에게
          <br />
          마음을 표현해보세요
        </h1>
        </div>
        <img
          src="/img/hearthand.png"
          alt="hearthand"
          className={styles.section4imgbox}
        ></img>
      </div>

      <div
        data-aos="fade-down"
        data-aos-duration="1000"
        className={styles.wrapper}
      >
        <img
          src="/img/click.png"
          alt="click"
          className={styles.section5imgbox}
        ></img>

        <div className={styles.section5textbox}>
        <h1>지금 바로</h1><MainButton />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
