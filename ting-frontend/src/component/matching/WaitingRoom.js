import { useState,useEffect, useRef } from "react"
import Swal from "sweetalert2";
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';

import tokenHttp from "../../api/tokenHttp";
import UserVideoComponent from "../../pages/openvidu/UserVideoComponent";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './WaitingRoom.css'
import { useSelector } from "react-redux";

function WaitingRoom(){
  const [userdata, setUserdata] = useState({});
  const [mySessionId, setMySessionId] = useState('SessionA');
  // const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));
  const [myUserName, setMyUserName] = useState(userdata.nickname);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  // 이 티켓 redux로 불러와야할 듯
  let [ticket, setTicket] = useState(10)
  let [start, setStart] = useState(0)
  let state = useSelector((state)=>state)

  useEffect(() => {
    console.log('나오냐')
    console.log(state.userdataReducer)
    // 유저 데이터 redux에서 가져옴
    setUserdata(state.userdataReducer.userdata)

    // tokenHttp.get('/user').then((response) => {
    //     // console.log(response.data.data)
    //     setUserdata(response.data.data)
    // })
    joinSession();

    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
        window.removeEventListener('beforeunload', onbeforeunload);
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

  // 화상 채팅 입장
  const joinSession = async () => {
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
        const token = await getToken();
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

      const getToken = async () => {
          const sessionId = await createSession(mySessionId);
          return await createToken(sessionId);
      };

      const createSession = async (sessionId) => {
          const response = await axios.post('https://i9b107.p.ssafy.io:5157' + '/api/sessions', { customSessionId: sessionId }, {
              headers: { 'Content-Type': 'application/json', },
          });
          return response.data; // The sessionId
      };

      const createToken = async (sessionId) => {
          const response = await axios.post('https://i9b107.p.ssafy.io:5157' + '/api/sessions/' + sessionId + '/connections', {}, {
              headers: { 'Content-Type': 'application/json', },
          });
          return response.data; // The token
      };

  return(
    <div>
      <h1>대기실</h1>
      <Container className='box'>
        <Row>
          <Col className='leftBox'>
            {publisher !== undefined ? (
              <div className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
                    <UserVideoComponent streamManager={publisher} />
                </div>
            ) : null}
          </Col>
          <Col className='rightBox'>
            <div className="stream-container col-md-6 col-xs-6">
              {userdata.nickname} 님의 상태
              <p>체크박스</p>
              <p>웹캠이 확인되었습니다</p>
              <p>체크박스</p>
              <p>마이크가 확인되었습니다.</p>
              <p>체크박스</p>
              <p>잔여티켓 {ticket}개</p>
              <MatchingStartButton ticket={ticket} setTicket={setTicket} start={start} setStart={setStart}  />
            </div>
          </Col>
        </Row>
      </Container>
      <div id="video-container">
      </div>
      <div>
        {/* 3가지 경우 */}
        {/* 잔여 티켓 0 */}
        {/* 잔여 티켓 1개 이상 */}
        {/* 매칭 시작 버튼 눌렀을 때 */}
      </div>
    </div>

  )
}

const MatchingStartButton = ({ start, setStart, ticket, setTicket })=>{

  let 남은시간 = '07:21'
  let 예상대기시간 = 5
  // 잔여 티켓 0
  if( ticket === 0 && start === 0 ){
    return
  }
  // 잔여 티켓 1 이상
  else if (ticket > 0 && start === 0 ){
    return (
      <button onClick={()=>{
        setTicket(ticket - 1)
        setStart(1)
      }}>매칭 시작</button>
    )
  }

  // 매칭시작 버튼 눌렀을 때
  if (start === 1){
    return(
      <div>
        <p>{ 남은시간 }</p>
        <p>예상 대기 시간 : { 예상대기시간 }분</p>


        <button onClick={()=>{ 
          alert()
        }}>
          임시 시작
        </button>
      </div>
    )
  }
};

function alert(){

  Swal.fire({
    icon: 'success',
    title: '매칭 성공',
    text: '매칭을 시작하시겠습니까?',
    timer : 5000,
    timerProgressBar : true,
    showCancelButton : true,
    cancelButtonText: '아니오',
    confirmButtonText : '네',
  }).then((res)=>{
    if (res.isConfirmed) {
      // 리덕스로 ticket 개수 -1
      window.location.href = "http://localhost:3000/matching/start"
    } else if (res.isDenied){
      // start 다시 0으로
      window.location.href = "http://localhost:3000/matching/"
    }
  })
}


export default WaitingRoom