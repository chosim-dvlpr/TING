import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import Webcam from "react-webcam";
import { setOpenviduToken } from "../../redux/openviduStore";
import { setMatchingId } from "../../redux/matchingStore";
import styles from './WaitingRoom.module.css';

function WaitingRoom() {
  const [socket, setSocket] = useState(null); // 연결된 소켓을 관리하는 state (null 일 경우 연결이 안된 것)
  const [expectTime, setExpectTime] = useState(99999); // 예상 대기시간 관리하는 state

  const dispatch = useDispatch();
  const navigate = useNavigate("");

  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)

  // 이 티켓 redux로 불러와야할 듯
  const [ticket, setTicket] = useState(0);
  const userdata = useSelector((state) => state.userdataReducer.userdata);

  
  useEffect(()=>{
    checkStreamStatus()
  },[isMicrophoneOn,isVideoOn])

  const checkStreamStatus = async ()=>{
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true, video:true})
      const audio = stream.getAudioTracks()
      const video = stream.getVideoTracks()
      const micStatus = audio.some(track => track.readyState === 'live')
      setIsMicrophoneOn(micStatus)
      const videoStatus = audio.some(track => track.readyState === 'live')
      setIsVideoOn(videoStatus)
    }
    catch (err) {
      console.log(err)
    }
  }

  // 웹소켓 연결
  const handleConnectClick = () => {
    const serverUrl = "wss://i9b107.p.ssafy.io:5157/matching";

    // socket 생성
    const ws = new WebSocket(serverUrl);

    // 최초 연결시 jwt 토큰 전달 (access-token, refresh-token 관리 필요 -> 어디에서 가져오는 로직?)
    ws.onopen = () => {
      console.log("소켓 연결 성공");
      setSocket(ws);
      const token = localStorage.getItem("access-token");
      // 토큰 redux에 저장
      dispatch(setOpenviduToken(token));

      ws.send(
        JSON.stringify({
          type: "jwt",
          data: {
            token: token,
          },
        })
      );
    };

    // 에러 발생시 호출되는 함수
    ws.onerror = (error) => {
      console.error("WebSocket connection error:", error);
    };

    // 연결이 끊어졌을 때 호출되는 함수
    ws.onclose = () => {
      setSocket(null);
    };

    // 서버로부터 메시지를 받았을 때 호출되는 함수
    ws.onmessage = ({ data }) => {
      let response = JSON.parse(data);
      console.log('여기 토큰')
      console.log(response);

      switch (response.type) {
        // 예상시간 출력
        case "expectedTime":
          let expectedTime = response.data.time;
          let minute = Math.floor(expectedTime / 60);
          let second = expectedTime % 60;
          setExpectTime(`${minute}분 ${second}초`);
          break;

        // 매칭 수락 모달을 띄움
        case "findPair":
          findPairModal(ws);
          break;

        // 양쪽 모두 매칭 성공 (redux에 openvidu token, matchingId 저장 후 화상화면으로 이동)
        case "matchingSuccess":
          let enterToken = response.data.token;
          let matchingId = response.data.matchingId;
          
          dispatch(setOpenviduToken(enterToken));
          dispatch(setMatchingId(matchingId));
        
          navigate("/matching/start");
          break;

        // 한쪽이 매칭 거절
        case "matchingFail":
          alert("상대방이 매칭을 받지 않았습니다.");
          break;
      }
    };
  };

  // 컴포넌트가 언마운트 될 때 호출되는 함수
  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 웹 소켓 연결을 끊음
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);


  // 경고창을 호출하는 함수
  function findPairModal(socket) {
    Swal.fire({
      icon: "success",
      title: "매칭 성공",
      text: "매칭을 시작하시겠습니까?",
      timer: 15000,
      timerProgressBar: true,
      showCancelButton: true,
      cancelButtonText: "아니오",
      confirmButtonText: "네",
    }).then((res) => {
      if (res.isConfirmed) {
        // TODO: findModal 에서 "네"를 눌렀을때, accept 메시지를 서버로 보내는 함수
        socket.send(JSON.stringify({ type: "accept" }));
      } else if (res.isDenied) {
        // TODO: findModal 에서 "아니오"를 눌렀을 때, reject 메시지를 서버로 보내는 함수
        socket.send(JSON.stringify({ type: "reject" }));
      }
    });
  }


  return (
    <div>

      <div className={styles.waitingMenu}>
        <button onClick={()=>{navigate("/shop")}}>아이템샵</button>
        <button onClick={()=>{navigate("/")}}>나가기</button>
      </div>
      <div className={styles.MainBox}>
      <Container>
        <Row>

          {/* 오른쪽 영상 박스 */}
          <Col className={`col-7 ${styles.leftBox}`}>
            { isVideoOn ?  (
              <Webcam className={styles.Webcam} audio={true} video={true}/>
            ) : (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
              </div>
            )}
          </Col>

          {/* 왼쪽 체크 박스 */}
          <Col className={`col-5 ${styles.rightBox}`}>
            <div className={`stream-container`}>

              {/* 마이크 확인 */}
              { isMicrophoneOn ? (
                  <div className={styles.successMessageBox}>
                    <img src="/img/VoiceOnIcon.png" alt="Voice on icon"/>
                    <p className={styles.textBox}>마이크가 켜져있습니다</p>
                  </div>
                ) : (
                <div className={styles.failMessageBox}>
                  <img src="/img/VoiceOffIcon.png" alt="Voice off icon"/>
                  <div className={styles.textBox}>
                    <p className={styles.failMessage}>마이크가 꺼져있습니다</p>
                    <p>설정에서 권한 허용 후에 새로고침 해주세요</p>
                  </div>
                </div>
              )}

              {/* 비디오 확인 */}
              { isVideoOn ? (
                <div className={styles.successMessageBox}>
                  <img src="/img/VideoOnIcon.png" alt="Video on icon"/>
                  <p className={styles.textBox}>웹캠이 켜져있습니다.</p>
                </div>
                ) : (
                <div className={styles.failMessageBox}>
                  <img src="/img/VideoOffIcon.png" alt="Video off icon"/>
                  <div className={styles.textBox}>
                    <p className={styles.failMessage}>비디오가 꺼져있습니다</p>
                    <p>설정에서 권한 허용 후에 새로고침 해주세요</p>
                  </div>
                </div>
              )}
              
              <p>잔여티켓 {ticket}개</p>

              {
              socket == null ? (
                <button onClick={handleConnectClick}>매칭 시작</button>
              ) : (
                <>
                  <div>매칭 시간 : <TimerComponent /></div>
                  <div>예상 대기시간 :{expectTime}</div>
                </>
              )
              }

            </div>
          </Col>
        </Row>
      </Container>
      </div>
      <div id="video-container"></div>
      <div>
        {/* 3가지 경우 */}
        {/* 잔여 티켓 0 */}
        {/* 잔여 티켓 1개 이상 */}
        {/* 매칭 시작 버튼 눌렀을 때 */}
      </div>

    </div>
  );
}

const TimerComponent = () => {
  const [time, setTime] = useState(0);

  // 1초마다 time 상태를 1씩 증가시키는 함수
  const increaseTime = () => {
    setTime((prevTime) => prevTime + 1);
  };

  // 컴포넌트가 처음 마운트될 때 타이머 시작
  useEffect(() => {
    const timerId = setInterval(increaseTime, 1000);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      <span>{time}초</span>
    </div>
  );
};

export default WaitingRoom;
