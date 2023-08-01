import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./WaitingRoom.css";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";

function WaitingRoom() {
  const [socket, setSocket] = useState(null); // 연결된 소켓을 관리하는 state (null 일 경우 연결이 안된 것)
  const [expectTime, setExpectTime] = useState(99999); // 예상 대기시간 관리하는 state

  const [userdata, setUserdata] = useState({});

  // 이 티켓 redux로 불러와야할 듯
  let [ticket, setTicket] = useState(10);
  let [start, setStart] = useState(0);
  let state = useSelector((state) => state);

  useEffect(() => {
    // 유저 데이터 redux에서 가져옴
    setUserdata(state.userdataReducer.userdata);
    console.log(state.userdataReducer.userdata);
  }, []);

  let navigate = useNavigate("");

  const handleConnectClick = () => {
    const serverUrl = "wss://i9b107.p.ssafy.io:5157/matching";

    // socket 생성
    const ws = new WebSocket(serverUrl);

    // 최초 연결시 jwt 토큰 전달 (access-token, refresh-token 관리 필요 -> 어디에서 가져오는 로직?)
    ws.onopen = () => {
      console.log("소켓 연결 성공");
      setSocket(ws);
      const token = localStorage.getItem("access-token");
      ws.send(
        JSON.stringify({
          type: "jwt",
          data: {
            token: token,
          },
        })
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket connection error:", error);
    };

    ws.onclose = () => {
      console.log("소켓 연결 끊김");
      alert("현재 매칭을 할 수 없습니다. (token 확인)");
      setSocket(null);
    };

    ws.onmessage = ({ data }) => {
      let response = JSON.parse(data);
      console.log(response);

      if (response.type === "expectedTime") {
        // TODO: 예상 시간을 출력하는 로직 추가 (state로 관리)
        let expectedTime = response.data.time;
        let minute = Math.floor(expectedTime / 60);
        let second = expectedTime % 60;
        setExpectTime(`${minute}분 ${second}초`);
      } else if (response.type === "findPair") {
        // TODO: 매칭 수락 모달창 띄우는 로직 추가.
        findPairModal();
      } else if (response.type === "matchingSuccess") {
        // TODO: 양쪽 모두 매칭이 성공했으므로 openvidu 페이지로 이동 (response.data 에 openvidu 입장 토큰이 담겨있음)
        let enterToken = response.data.token;

        // redux에 토큰 넣고, navigate로 페이지 이동

        navigate("/matching/start");
      } else if (response.type === "matchingFail") {
        // TODO: 상대방이 매칭을 받지 않았으므로 다시 매칭을 기다려야 함
      }
    };
  };

  // findModal 에서 "네"를 눌렀을때, accept 서버로 보내는 함수

  // findModal 에서 "아니오"를 눌렀을 때, reject 서버로 보내는 함수


  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 웹 소켓 연결을 끊음
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <div>
      <h1>대기실</h1>
      <Container className="box">
        <Row>
          <Col className='leftBox'>
            <Webcam 
              audio={true}
            />
          </Col>
          <Col className="rightBox">
            <div className="stream-container col-md-6 col-xs-6">
              {userdata.nickname} 님의 상태
              <p>체크박스</p>
              <p>웹캠이 확인되었습니다</p>
              <p>체크박스</p>
              <p>마이크가 확인되었습니다.</p>
              <p>체크박스</p>
              <p>잔여티켓 {ticket}개</p>
              {/* <MatchingStartButton
                ticket={ticket}
                setTicket={setTicket}
                start={start}
                setStart={setStart}
                navigate={navigate}
              /> */}
              {/* 소켓에 연결이 안되어있으면 매칭 시작 버튼,
                연결이 되어 있다면 예상시간과 대기시간 출력
              */}
              {socket == null ? (
                <button onClick={handleConnectClick}>매칭 시작</button>
              ) : (
                <>
                  <div>
                    매칭 시간 : <TimerComponent />
                  </div>
                  <div>예상 대기시간 :{expectTime}</div>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
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

const MatchingStartButton = ({ start, setStart, ticket, setTicket, navigate })=>{

  let [micandVideo,setMicandVideo] = useState(0)

  navigator.mediaDevices.getUserMedia({audio:true, video:true})
    .then(() => {setMicandVideo(1)})
    .catch(err=>{console.log(err)})

  let 남은시간 = '07:21'
  let 예상대기시간 = 5
  // 잔여 티켓 0
  if( ticket === 0 && start === 0 ){
    return
  }
  // 잔여 티켓 1 이상
  else if (ticket > 0 && start === 0 && micandVideo === 1){
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
          alert(navigate)
        }}>
          임시 시작
        </button>
      </div>
    )
  }
};

function findPairModal(navigate) {
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
      // 리덕스로 ticket 개수 -1
      // window.location.href = "http://localhost:3000/matching/start"

      // 매칭이 성공했을 떄 화상화면 페이지로 이동
      navigate("/matching/start");
    } else if (res.isDenied) {
      // start 다시 0으로
      // window.location.href = "http://localhost:3000/matching/"
      navigate('/matching')
    }
  });
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
