import { useState, useEffect } from "react";
import { OpenVidu } from "openvidu-browser";
import UserVideoComponent from "../../pages/openvidu/UserVideoComponent.js";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionData, setQuestionNumber, setYourData, setMyScore, setYourScore, setMatchingResult, resetMatchingStore } from "../../redux/matchingStore.js";
import { useNavigate } from "react-router-dom";
import tokenHttp from "../../api/tokenHttp.js";
import styles from "./MatchingStart.module.css";
import Report from "./common/Report.js";
import MatchingChoice from "./common/MatchingChoice.js";

function MatchingStart() {
  // redux 관련 state 불러오기
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const userData = state.userdataReducer.userdata;
  const myScore = state.matchingReducer.myScore;
  const yourScore = state.matchingReducer.yourScore;
  const questionData = state.matchingReducer.questionData;
  const questionNumber = state.matchingReducer.questionNumber;
  const matchingId = state.matchingReducer.matchingId;

  // react-router
  const navigate = useNavigate();

  //  점수 알림창 관련 state
  const [showScoreMessage, setShowScoreMessage] = useState(false);
  const [alertScore, setAlertScore] = useState("");

  // timerBar 관련 state
  const [count, setCount] = useState(0);
  const [startTimer, setStartTimer] = useState(false);

  // ScoreCheck 점수 클릭 관련 state
  const [buttonToggleSign, setButtonToggleSign] = useState([false, false, false, false, false, false, false, false, false, false, false]);
  const [disableHover, setDisableHover] = useState([false, false, false, false, false, false, false, false, false, false, false]);
  const trueList = [true, true, true, true, true, true, true, true, true, true, true];
  const [disableaButton, setDisableButton] = useState(false);

  // 최종 점수 관련 state
  const [sumMyScore, setSumMyScore] = useState(0)
  const [sumYourScore, setSumYourScore] = useState(0) 

  // openvidu 관련 state
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [session, setSession] = useState(undefined);

  // 신고 모달창 관련 state
  const [showReportModal, setShowReportModal] = useState(false);

  // 최종 선택 모달창 관련 state
  const [showMatchingChoiceModal, setShowMatchingChoiceModal] = useState(false)

  // 초기화 useEffect hook
  useEffect(() => {
    console.log("====================useEffect (초기화) ======================");
    dispatch(resetMatchingStore())

    // redux에서 오픈 비두 입장 토큰 가져오기
    let accessToken = state.openviduReducer.token;
    let matchingId = state.matchingReducer.matchingId;

    // 오픈 비두 입장 토큰이 없으면 경고창 띄우고 메인으로 돌려보내기
    if (accessToken === null) {
      alert("로그인 후 돌아오세요");
      navigate("/");
    }

    //state에 토큰을 저장하고 joinSession 메서드 호출
    tokenHttp.get(`/date/question/${matchingId}`).then((response) => {
      dispatch(setQuestionData(response.data.data));
    });

    // openvidu 접속
    joinSession(accessToken);

    window.addEventListener("beforeunload", onbeforeunload);
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
    };
  }, []);

  // 질문카드를 제어하는 useEffect hook
  useEffect(() => {
    console.log("================useEffect (score 변경)=====================");
    if (questionNumber < Math.min(myScore.length, yourScore.length)) {
      // questionNumber 바로 안바뀌게 잠시 시간 텀 줌
      setTimeout(()=>{
        dispatch(setQuestionNumber(Math.min(myScore.length, yourScore.length)));
      },2000)
    }
  }, [myScore, yourScore]);

  // timerBar를 제어하는 useEffect hook
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);

    if (questionNumber === 0 && startTimer == false) {
      setCount(10);
      setStartTimer(true);
    }

    if (count === -1) {
      clearInterval(timer);
      setCount(30);
      
      // 타임이 끝나면 5점을 자동으로 상대에게 전달

      // 이미 점수를 선택했다면 상대에게 점수를 전송하지 않음
      let alreadyClickedScore = false;
      buttonToggleSign.map((sign) => {
        if (sign) alreadyClickedScore = true;
      });
      if (alreadyClickedScore) return;

      session.signal({
        data: JSON.stringify({ score: 5, userId: userData.userId }),
        to: [],
        type: "score",
      });

      // TODO: myScore에 5점 추가하는 로직
      dispatch(setMyScore(5));

      // TODO: API로 점수 저장하는 로직
    }
    return () => {
      clearInterval(timer);
    };
  }, [count]);

  // 모든 질문이 끝났을 떄 제어하는 useEffect hook
  useEffect(() => {
    // 버튼 재활성화
    setDisableButton(false);
    setDisableHover([false, false, false, false, false, false, false, false, false, false, false]);
    setButtonToggleSign([false, false, false, false, false, false, false, false, false, false, false]);
    if (questionNumber !== 0) {
      setCount(30);
    }
    if (questionNumber === 11) {
      setCount(5);
    }
    if (questionNumber === 12) {
      setCount(5);
      // 결과 최종합
      setSumMyScore(myScore.slice(1,11).reduce((acc,curr)=>acc+curr, 0))
      setSumYourScore(yourScore.slice(1,11).reduce((acc,curr)=>acc+curr, 0))
      // 최종 점수 DB에 저장
      const totalScoreData = {
        matchingId : matchingId,
        totalScore : sumYourScore,
      }
      tokenHttp.post('/date/score/total',totalScoreData)
        .then((response)=>{console.log(response.data.message)})
        .catch((err)=>{console.log(err)})
    }
    if (questionNumber === 14) {
      setShowMatchingChoiceModal(true)
      setCount(20)
    }
  }, [questionNumber]);

  const handleScoreSelect = (score) => {
    // TODO: 점수를 서버로 전송하는 로직

    // TODO: myScore에 추가하는 로직
    dispatch(setMyScore(score));

    // TODO: 상대에게 점수를 전송하는 로직 (openviduSession.signal)
    session.signal({
      data: JSON.stringify({ score: score, userId: userData.userId }),
      to: [],
      type: "score",
    });
  };

  const onbeforeunload = (event) => {
    console.log("==================onbeforeunload====================");
    leaveSession();
  };

  const handleMainVideoStream = (stream) => {
    console.log("==================handleMainVideoStream====================");
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const deleteSubscriber = (streamManager) => {
    console.log("==================deleteSubscriber====================");
    setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub !== streamManager));
  };

  const joinSession = async (accessToken) => {
    console.log("==================joinSession====================");
    // --- 1) Get an OpenVidu object ---
    const OV = new OpenVidu();

    // --- 2) Init a session ---
    const newSession = OV.initSession();

    // --- 3) Specify the actions when events take place in the session ---
    // On every new Stream received...
    newSession.on("streamCreated", (event) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own\
      console.log("======================streamCreated=====================");
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      newSession.signal({
        data: JSON.stringify(userData),
        to: [],
        type: "init",
      });
    });

    // On every Stream destroyed...
    newSession.on("streamDestroyed", (event) => {
      console.log("======================streamDestroyed=====================");
      deleteSubscriber(event.stream.streamManager);
    });

    // On every asynchronous exception...
    newSession.on("exception", (exception) => {
      console.log("======================exception=====================");
      console.warn(exception);
    });

    // 최초 연결시 데이터 동기화를 위한 로직 (상대방 정보를 redux에 세팅)
    newSession.on("signal:init", (event) => {
      console.log("======================signal:init=====================");
      let data = JSON.parse(event.data);
      if (data.userId !== userData.userId) {
        dispatch(setYourData(data));
      }
    });

    // 상대방이 점수를 선택했을때 실행되는 함수
    newSession.on("signal:score", (event) => {
      console.log("======================signal:score=====================");
      let data = JSON.parse(event.data);
      
      // 내가 던진 점수 시그널은 무시
      if (data.userId === userData.userId) return;

      // 점수를 yourScore에 저장
      dispatch(setYourScore(data.score));

      // 경고창 자동 삭제
      setAlertScore(data.score + "점");
      setShowScoreMessage(true);
      setTimeout(() => {
        setShowScoreMessage(false);
      }, 2000);
    });

    // 최종점수를 받는 로직
    newSession.on("signal:lastScore", (event) => {
      console.log("======================signal:lastScore=====================");
      let data = JSON.parse(event.data);
    });

    // 최종선택의 결과를 받는 로직
    newSession.on("signal:choice", (event) => {
      console.log("======================signal:choice=====================");
      let data = JSON.parse(event.data);
    });

    // 상대방이 신고 후 나가기를 했을 때 실행되는 로직
    newSession.on("signal:report", (event) => {
      console.log("======================signal:report=====================");
      const data = JSON.parse(event.data);

      // 내가 던진 점수 시그널은 무시
      if (data.userId === userData.userId) return;

      alert("상대방과의 연결이 끊어졌습니다.");
      navigate("/");
    });

    // 최종 선택 정보를 받는 로직
    newSession.on("signal:select", (event) => {
      console.log("======================signal:select=====================");
      const data = JSON.parse(event.data)

      // 내가 선택한 시그널은 무시
      if (data.userId === userData.userId) return;

      dispatch(setMatchingResult(data))
    })


    // --- 4) Connect to the session with a valid user token ---
    // Get a token from the OpenVidu deployment
    try {
      // const token = await getToken();
      const token = accessToken;
      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      await newSession.connect(token, { clientData: userData });

      // --- 5) Get your own camera stream ---
      // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
      // element: we will manage it on our own) and with the desired properties
      let newPublisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: undefined, // The source of video. If undefined default webcam
        publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
        publishVideo: true, // Whether you want to start publishing with your video enabled or not
        resolution: "640x480", // The resolution of your video
        frameRate: 30, // The frame rate of your video
        insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
        mirror: false, // Whether to mirror your local video or not
      });

      // --- 6) Publish your stream ---
      newSession.publish(newPublisher);

      // Obtain the current video device in use
      const devices = await OV.getDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      const currentVideoDeviceId = newPublisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
      const currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);

      // Set the main video in the page to display our webcam and store our Publisher
      setMainStreamManager(newPublisher);
      setPublisher(newPublisher);
      setSession(newSession);
    } catch (error) {
      console.log("There was an error connecting to the session:", error.code, error.message);
    }
  };

  const leaveSession = () => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    if (session) {
      session.disconnect();
    }

    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  const report = () => {
    setShowReportModal(true);
  };

  return (
    <div className={`${styles.container}`}>

      <div>
        <h3 className={styles.timer}>{count}</h3>
      </div>
      { questionNumber>0 && questionNumber<11 && showScoreMessage &&
          <div className={styles.alertScore}>
            <img src={"/img/heart-icon2.png"} id={`buttonImg-${alertScore}`}/>
            <span className={styles.ScoreText}>{alertScore}</span>
          </div>
      }

      <div id="session-header" className={styles.sessionHeader}>
        <input className="btn btn-large btn-danger" type="button" id="buttonLeaveSession" onClick={report} value="신고 후 나가기" />
      </div>

      <div id="session" className={styles.session}>

        {/* 질문 카드 */}
        {/* <QuestionCard /> */}
        <div className={styles.cardOuter}>
          <img src={`/img/card/card${questionNumber}.png`} alt="card" className={styles.trumpCard}/>
          <span className={styles.cardContent}>{questionData[questionNumber]?.questionCard}</span>
        </div>
        {/* 질문 카드 -- end */}

        {/* 비디오 화면 */}
        <div className={styles.videoContainer}>

          <div className={`stream-container col-md-5 col-xs-5`} onClick={() => handleMainVideoStream(publisher)}>
            <UserVideoComponent streamManager={publisher} />
          </div>

          <div className="stream-container col-md-5 col-xs-5" onClick={() => handleMainVideoStream(subscribers[0])}>
            <UserVideoComponent streamManager={subscribers[0]} />
          </div>
          
        </div>
      </div>
      
      <div className="wrapper">
      {/* 점수 체크판 -- start */}
      {/* <ScoreCheck></ScoreCheck> */}
      { showMatchingChoiceModal ? null : (
        <div className={styles.ScoreCheckBox}>

          {questionNumber === 0 ? (
            <h1>서로 간단히 인사를 나누세요 :) 바로 시작합니다.</h1>
          ) : questionNumber === 11 ? (
            <h1>끝이 났습니다.</h1>
          ) : questionNumber === 12 ? (
            <div>
              <h1>최종 점수</h1>
              <h1>내가 받은 점수 : {sumYourScore} </h1>
              <h1>상대가 받은 점수 : {sumMyScore} </h1>
            </div>
          ) : questionNumber === 13 ? (
            <h1>서로 마지막 어필을 해주세요</h1>
          ) : 0 <= questionNumber <= 10 ? (
            <div className={styles.ScoreBox}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score, i) => {
                return (
                  <div className={`${styles.HeartScore} ${ !disableHover[i] ? styles.HeartScoreAni : null}`}>
                    <img 
                      src={buttonToggleSign[i] ? "/img/heart-icon-toggle2.png" : "/img/heart-icon2.png"} 
                      id={`buttonImg-${score}`} 
                      className={buttonToggleSign[i] ? styles.clickedHeart : null}
                      />

                    <button
                      className={styles.ScoreText}
                      disabled={disableaButton}
                      onClick={() => {
                        setButtonToggleSign([...buttonToggleSign.slice(0, i), true, ...buttonToggleSign.slice(i + 1)]);
                        setDisableHover([...trueList.slice(0, i), true, ...trueList.slice(i + 1)])
                        setDisableButton(true)
                        handleScoreSelect(score);
                      }}
                    >
                      {score}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div> )
        }
        {/* 점수 체크판 -- end */}

        {/* 신고 모달창 */}
        {showReportModal && <Report setShowReportModal={setShowReportModal} session={session} />}

        {/* 최종 선택 */}
        {showMatchingChoiceModal && <MatchingChoice session={session} count={count}/>}

      </div>
    </div>
  );
}


export default MatchingStart;