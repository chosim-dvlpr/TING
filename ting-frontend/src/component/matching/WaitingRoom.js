import { useState,useEffect } from "react"
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './WaitingRoom.css'
import { useSelector } from "react-redux";
import Webcam from "react-webcam"

function WaitingRoom(){
  const [userdata, setUserdata] = useState({});

  // 이 티켓 redux로 불러와야할 듯
  let [ticket, setTicket] = useState(10)
  let [start, setStart] = useState(0)
  let state = useSelector((state)=>state)

  useEffect(() => {
    // 유저 데이터 redux에서 가져옴
    setUserdata(state.userdataReducer.userdata)
    console.log(state.userdataReducer.userdata)
  }, []);

  let navigate = useNavigate("");



  return(
    <div>
      <h1>대기실</h1>
      <Container className='box'>
        <Row>
          <Col className='leftBox'>
            <h1>여기는 웹캠</h1>
            <Webcam/>
            <h1>여긴 소리</h1>

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
              <MatchingStartButton ticket={ticket} setTicket={setTicket} start={start} setStart={setStart} navigate={navigate} />
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

const MatchingStartButton = ({ start, setStart, ticket, setTicket, navigate })=>{

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
          alert(navigate)
        }}>
          임시 시작
        </button>
      </div>
    )
  }
};

function alert(navigate){

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
      // window.location.href = "http://localhost:3000/matching/start"
      navigate('/matching/start')
    } else if (res.isDenied){
      // start 다시 0으로
      // window.location.href = "http://localhost:3000/matching/"
      navigate('/matching')
    }
  })
}


export default WaitingRoom