import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

import AOS from "aos";
import "./aos.css";

import styles from "./MainPage.module.css";

//component
import CountdownTimer from "../component/main/CountdownTimer";
import MainButton from "../component/main/MainButton";

import NavBar from "../component/common/NavBar";
import FriendButton from "../component/common/FriendButton";
import useMessageStore from "../component/friend/useMessageStore";
import { useSelector } from "react-redux";

function MainPage() {
  // 채팅 기능 추가 //
  const messageStore = useMessageStore();
  const userdata = useSelector((state) => state.userdataReducer.userdata);

  const { connected, currentRoomIndex, roomIndices, messageLogsObject } =
    messageStore;

  // 모든 채팅방 연결
  const connectSocket = () => {
    messageStore.connect(null, userdata.userId);
  };

  useEffect(() => {
    if (userdata) {
      connectSocket();
    }
  }, [userdata]);
  // 여기까지 채팅 //

  // useEffect(() => {
  //   AOS.init();
  //   return () => {
  //     AOS.refresh(); // 컴포넌트가 언마운트될 때 AOS를 해제
  //   };
  // }, []);

  const [wheelHandlerActive, setWheelHandlerActive] = useState(true);
  const outerDivRef = useRef();
  const wheelHandler = (e) => {
    // e.preventDefault();
    const { deltaY } = e;
    const { scrollTop } = outerDivRef.current; // 스크롤 위쪽 끝부분 위치
    const pageHeight = window.innerHeight; // 화면 세로길이, 100vh와 같습니다.

    if (deltaY > 0) {
      // 스크롤 내릴 때
      if (scrollTop >= 0 && scrollTop < pageHeight - 5) {
        //현재 1페이지
        outerDivRef.current.scrollTo({
          top: pageHeight,
          left: 0,
          behavior: "smooth",
        });
      } else if (
        scrollTop >= pageHeight - 5 &&
        scrollTop < pageHeight * 2 - 5
      ) {
        //현재 2페이지
        outerDivRef.current.scrollTo({
          top: pageHeight * 2,
          left: 0,
          behavior: "smooth",
        });
      } else if (
        scrollTop >= pageHeight * 2 - 5 &&
        scrollTop < pageHeight * 3 - 5
      ) {
        // 현재 3페이지
        outerDivRef.current.scrollTo({
          top: pageHeight * 3,
          left: 0,
          behavior: "smooth",
        });
      } else {
        // 현재 4페이지
        outerDivRef.current.scrollTo({
          top: pageHeight * 4,
          left: 0,
          behavior: "smooth",
        });
      }
    } else {
      // 스크롤 올릴 때
      if (scrollTop >= 0 && scrollTop < pageHeight + 5) {
        //현재 1페이지
        outerDivRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      } else if (
        scrollTop >= pageHeight + 5 &&
        scrollTop < pageHeight * 2 + 5
      ) {
        //현재 2페이지
        outerDivRef.current.scrollTo({
          top: pageHeight,
          left: 0,
          behavior: "smooth",
        });
      } else if (
        scrollTop >= pageHeight * 2 + 5 &&
        scrollTop < pageHeight * 3 + 5
      ) {
        // 현재 3페이지
        outerDivRef.current.scrollTo({
          top: pageHeight * 2,
          left: 0,
          behavior: "smooth",
        });
      } else {
        outerDivRef.current.scrollTo({
          top: pageHeight * 3,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  };

  const scrollStyle = () => {
    outerDivRef.current.className = styles.outer;
  };

  const noScrollStyle = () => {
    outerDivRef.current.className = styles.outerNoScroll;
  };

  useEffect(() => {
    if (wheelHandlerActive) {
      window.addEventListener("wheel", wheelHandler);
      window.addEventListener("DOMMouseScroll", wheelHandler);
      window.addEventListener("mousewheel", wheelHandler);
      scrollStyle();
    } else {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("DOMMouseScroll", wheelHandler);
      window.removeEventListener("mousewheel", wheelHandler);
      noScrollStyle();
    }

    return () => {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("DOMMouseScroll", wheelHandler);
      window.removeEventListener("mousewheel", wheelHandler);
    };
  }, [wheelHandler, wheelHandlerActive]);

  return (
    <div ref={outerDivRef} className={styles.outer}>
      <NavBar />
      {userdata && (
        <FriendButton
          toggleWheelHandler={() => setWheelHandlerActive((active) => !active)}
        />
      )}

      {/*section1 */}
      <div className={styles.wrapper}>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        <div className={styles.snowflake}>
          <img src="/img/heart_1.png"></img>
        </div>
        {/* <div className={styles.backgroundFish} id={styles.backgroundFish1}>
          <img src="/img/fish_group_1.png"></img>
        </div>
        <div className={styles.backgroundFish} id={styles.backgroundFish2}>
          <img src="/img/fish_group_2.png"></img>
        </div> */}
        <div className={styles.section1textbox}>
          <h1>
            5분 <span id={styles.textDeco}> TING!! </span>으로<br></br>사랑을
            찾아봐
          </h1>
        </div>
        <div className={styles.section1imgbox}>
          {/* <Link to="/matching" className={styles.linkButton}>
            <img src="/img/heart_1.png" alt="main" className={styles.img}></img>
          </Link> */}
          <MainButton></MainButton>
        </div>
        <div className={styles.down}>
          <span>팅은 어떤 서비스인가요?</span>↓
        </div>
        {/* <div>
          <img src="/img/arrow.png"></img>
        </div> */}
      </div>

      {/*section2 */}
      <div
        // data-aos="fade-down"
        // data-aos-duration="1000"
        className={styles.wrapper}
      >
        <img
          src="/img/watch.png"
          alt="watch"
          className={styles.section2imgbox}
        ></img>

        <div className={styles.section2textbox}>
          <CountdownTimer />
          <h2>
            5분 동안 어떤 일을<br></br>할 수 있을까요?
          </h2>
        </div>
      </div>

      {/*section3 */}
      <div
        // data-aos="fade-down"
        // data-aos-duration="1000"
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
          <h2>
            팅에서는
            <br />
            5분 안에
            <br />
            상대의 취미부터 취향까지
            <br />
            바로 확인 할 수 있습니다
          </h2>
        </div>
      </div>

      {/*section4 */}
      <div
        // data-aos="fade-down"
        // data-aos-duration="1000"
        className={styles.wrapper}
      >
        <div className={styles.section2textbox}>
          <h2>
            5분 후<br />
            상대에게
            <br />
            마음을 표현해보세요
          </h2>
        </div>
        <img
          src="/img/hearthand.png"
          alt="hearthand"
          className={styles.section4imgbox}
        ></img>
      </div>

      {/* section5 */}
      <div
        // data-aos="fade-down"
        // data-aos-duration="1000"
        className={styles.wrapper}
      >
        <div className={styles.backgroundFish} id={styles.backgroundFish1}>
          <img src="/img/fish_group_1.png"></img>
        </div>
        <div className={styles.backgroundFish} id={styles.backgroundFish2}>
          <img src="/img/fish_group_2.png"></img>
        </div>
        <img
          src="/img/click.png"
          alt="click"
          className={styles.section5imgbox}
        ></img>

        <div className={styles.section5textbox}>
          <h1>지금 바로</h1>
          <MainButton />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
