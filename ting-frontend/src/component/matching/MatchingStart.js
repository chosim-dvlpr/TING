import OpenVideo from "../../pages/openvidu/openvidu-main.js";

import React, { useState, useEffect, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "../../pages/openvidu/UserVideoComponent.js";

import { useDispatch, useSelector } from "react-redux";
import "./MatchingStart.css";
import { useNavigate } from "react-router-dom";
import ScoreCheck from "./asset/ScoreCheck.js";
import tokenHttp from "../../api/tokenHttp.js";
import { setQuestionData, setQuestionNumber, setYourData, setOpenviduSession, setYourScore } from "../../redux/matchingStore.js";
import QuestionCard from "./asset/QuestionCard.js";

const APPLICATION_SERVER_URL = process.env.REACT_APP_SERVER_URL;

function MatchingStart() {
  // redux
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  // openvidu 관련 state
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [session, setSession] = useState(undefined);

  // redux state
  const userdata = state.userdataReducer.userdata;
  const yourData = state.matchingReducer.yourData;
  const myScore = state.matchingReducer.myScore;
  const yourScore = state.matchingReducer.yourScore;

  // react-router
  const navigate = useNavigate();

  useEffect(() => {
    // redux에서 오픈 비두 입장 토큰 가져오기
    let accessToken = state.openviduReducer.token;

    // 오픈 비두 입장 토큰이 없으면 경고창 띄우고 메인으로 돌려보내기
    if (accessToken === null) {
      alert("로그인 후 돌아오세요");
      navigate("/");
    }

    //state에 토큰을 저장하고 joinSession 메서드 호출
    tokenHttp.get("/date/question").then((response) => {
      dispatch(setQuestionData(response.data.data));
    });

    // openvidu 접속
    joinSession(accessToken);

    window.addEventListener("beforeunload", onbeforeunload);
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
    };
  }, []);

  // 질문카드를 제어하는 로직
  useEffect(() => {
    dispatch(setQuestionNumber(Math.min(myScore.length, yourScore.length)));
  }, [myScore, yourScore]);

  const onbeforeunload = (event) => {
    leaveSession();
  };

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub !== streamManager));
  };

  const joinSession = async (accessToken) => {
    // --- 1) Get an OpenVidu object ---
    const OV = new OpenVidu();

    // --- 2) Init a session ---
    const newSession = OV.initSession();
    setSession(newSession);

    // --- 3) Specify the actions when events take place in the session ---
    // On every new Stream received...
    newSession.on("streamCreated", (event) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      console.log("상대방이 들어옴");
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      newSession.signal({
        data: JSON.stringify(userdata),
        to: [],
        type: "init",
      });
    });

    // On every Stream destroyed...
    newSession.on("streamDestroyed", (event) => {
      console.log("상대방이 나감");
      deleteSubscriber(event.stream.streamManager);
    });

    // On every asynchronous exception...
    newSession.on("exception", (exception) => {
      console.warn(exception);
    });

    // 최초 연결시 데이터 동기화를 위한 로직 (상대방 정보를 redux에 세팅)
    newSession.on("signal:init", (event) => {
      let data = JSON.parse(event.data);
      if (data.userId !== userdata.userId) {
        dispatch(setYourData(data));
      }
    });

    // 상대방이 점수를 선택했을때 실행되는 함수
    newSession.on("signal:score", (event) => {
      console.log("signal:score 실행", event.data);
      let data = JSON.parse(event.data);

      console.log(yourData);
      if (data.userId !== yourData.userId) return;

      // 점수를 yourScore에 저장
      dispatch(setYourScore([...yourScore, data.score]));

      // TODO: 상대방이 선택한 점수 표시 (이 부분에 음성 출력)
      alert("상대방이 " + data.score + "점을 선택했습니다.");

      // 점수 저장 api 호출
      // tokenHttp.post("/date/score");
      
    });

    // 최종점수를 받는 로직
    newSession.on("signal:lastScore", (event) => {
      let data = JSON.parse(event.data);
      console.log(data);
    });

    // 최종선택의 결과를 받는 로직
    newSession.on("signal:choice", (event) => {
      let data = JSON.parse(event.data);
      console.log(data);
    });

    // --- 4) Connect to the session with a valid user token ---
    // Get a token from the OpenVidu deployment
    try {
      // const token = await getToken();
      const token = accessToken;
      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      await newSession.connect(token, { clientData: userdata });

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
      dispatch(setOpenviduSession(newSession));
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

  return (
    <div className="container">
      <div id="session">
        <div id="session-header">
          <input className="btn btn-large btn-danger" type="button" id="buttonLeaveSession" onClick={leaveSession} value="Leave session" />
        </div>

        {/* 질문 카드 */}
        <QuestionCard />

        <div id="video-container">
          {publisher !== undefined ? (
            <div className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
              <UserVideoComponent streamManager={publisher} />
            </div>
          ) : null}

          {subscribers.map((sub, i) => (
            <div key={sub.id} className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(sub)}>
              <UserVideoComponent streamManager={sub} />
            </div>
          ))}
        </div>
      </div>

      {/* 점수 체크판 */}
      <ScoreCheck></ScoreCheck>
    </div>
  );
}

export default MatchingStart;
