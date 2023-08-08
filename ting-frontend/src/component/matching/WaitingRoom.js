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

  const [userdata, setUserdata] = useState({});
  let dispatch = useDispatch();
  let navigate = useNavigate("");

  // 이 티켓 redux로 불러와야할 듯
  let [ticket, setTicket] = useState(0);
  let state = useSelector((state) => state);

  useEffect(() => {
    // 유저 데이터 redux에서 가져옴
    setUserdata(state.userdataReducer.userdata);
    console.log(state.userdataReducer.userdata);
  }, []);

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

      <div className={styles.waitingMenu}>
        <button onClick={()=>{navigate("/shop")}}>아이템샵</button>
        <button onClick={()=>{navigate("/")}}>나가기</button>
      </div>
      
      <Container className={styles.box}>
        <Row>
          <Col className={styles.leftBox}>
            <Webcam className={styles.Webcam} audio={true} />
          </Col>
          <Col className={styles.rightBox}>
            <div className={`col-md-6 col-xs-6 stream-container`}>
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
                  <button
                    onClick={() => {
                      findPairModal(navigate);
                    }}
                  >
                    테스트 버튼
                  </button>
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
