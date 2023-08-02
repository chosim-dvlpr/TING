import OpenVideo from '../../pages/openvidu/openvidu-main.js'

import React, { useState, useEffect, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import UserVideoComponent from '../../pages/openvidu/UserVideoComponent.js';

import { useDispatch, useSelector } from 'react-redux';
import './MatchingStart.css'
import { useNavigate } from 'react-router-dom';
import ScoreCheck from './asset/ScoreCheck.js';
import tokenHttp from '../../api/tokenHttp.js';
import { getQuestionData } from '../../redux/matchingStore.js'
import QuestionCard from './asset/QuestionCard.js';

const APPLICATION_SERVER_URL = process.env.REACT_APP_SERVER_URL;

function MatchingStart(){
  const [userdata, setUserdata] = useState({});
  const [mySessionId, setMySessionId] = useState('SessionA');
  const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));
//   const [myUserName, setMyUserName] = useState('');
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [question, setQuestion] = useState([]);

  let state = useSelector((state)=>state);
  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => { 
    // userdata redux에서 가져옴
    setUserdata(state.userdataReducer.userdata)
    // setMyUserName(userdata.nickname)   

    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
        window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, []);

  useEffect(() => { 
    // redux에서 오픈 비두 입장 토큰 가져오기
    let accessToken = state.openviduReducer.token
 
    // 오픈 비두 입장 토큰이 없으면 경고창 띄우고 메인으로 돌려보내기
    if (accessToken === null){
      alert('로그인 후 돌아오세요')
      navigate('/')
    }
    //state에 토큰을 저장하고 joinSession 메서드 호출
    // TODO: 카드 정보 redux에 저장
    tokenHttp.get('/date/question').then((response) => {
      // console.log(response.data.dat a)
      dispatch(getQuestionData(response))
    })
    joinSession(accessToken)

    return () => {
    };
  }, []);


  const onbeforeunload = (event) => {
      leaveSession();
  };

  const handleChangeSessionId = (e) => {
      setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
      setMyUserName(e.target.value);
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
      newSession.on('streamCreated', (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          console.log('상대방이 들어옴')
          const subscriber = newSession.subscribe(event.stream, undefined);
          setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      // On every Stream destroyed...
      newSession.on('streamDestroyed', (event) => {
          console.log('상대방이 나감')
          deleteSubscriber(event.stream.streamManager);
      });

      // On every asynchronous exception...
      newSession.on('exception', (exception) => {
          console.warn(exception);
      });

      // --- 4) Connect to the session with a valid user token ---
      // Get a token from the OpenVidu deployment
      try {
          // const token = await getToken();
          const token = accessToken
          // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          await newSession.connect(token, { clientData: myUserName });

          // --- 5) Get your own camera stream ---
          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let newPublisher = await OV.initPublisherAsync(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: '640x480', // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---
          newSession.publish(newPublisher);

          // Obtain the current video device in use
          const devices = await OV.getDevices();
          const videoDevices = devices.filter((device) => device.kind === 'videoinput');
          const currentVideoDeviceId = newPublisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
          const currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);

          // Set the main video in the page to display our webcam and store our Publisher
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
      } catch (error) {
          console.log('There was an error connecting to the session:', error.code, error.message);
      }
  };

  const leaveSession = () => {
      // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
      if (session) {
          session.disconnect();
      }

      // Empty all properties...
      setSession(undefined);
      setSubscribers([]);
      setMySessionId('SessionA');
      // setMyUserName('Participant' + Math.floor(Math.random() * 100));
      setMyUserName(userdata.nickname);
      setMainStreamManager(undefined);
      setPublisher(undefined);
  };

    return (
      <div className="container">
            <div id="session">
              <div id="session-header">
                <h1 id="session-title">{mySessionId}</h1>
                <input
                  className="btn btn-large btn-danger"
                  type="button"
                  id="buttonLeaveSession"
                  onClick={leaveSession}
                  value="Leave session"
                />
              </div>

              {/* 질문 카드 */}
              <QuestionCard/>

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
};

export default MatchingStart