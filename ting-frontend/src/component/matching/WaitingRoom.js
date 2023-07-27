import { useState } from "react"

function WaitingRoom(){
  let [ticket, setTicket] = useState(10)
  let [start, setStart] = useState(0)

  // 이 티켓 redux로 불러와야할 듯

  return(
    <div>
      <h1>대기실</h1>
      <div>자신의 웹캠</div>
      <div>
        <p>체크박스</p>
        <p>웹캠이 확인되었습니다</p>
        <p>체크박스</p>
        <p>마이크가 확인되었습니다.</p>
        <p>체크박스</p>
        <p>잔여티켓 {ticket}개</p>
      </div>
      <div>
        {/* 3가지 경우 */}
        {/* 잔여 티켓 0 */}
        {/* 잔여 티켓 1개 이상 */}
        {/* 매칭 시작 버튼 눌렀을 때 */}
        <MatchingStartButton ticket={ticket} setTicket={setTicket} start={start} setStart={setStart}  />
      </div>
    </div>

  )
}

const MatchingStartButton = ({ start, setStart, ticket, setTicket })=>{

  let 남은시간 = '07:21'
  let 예상대기시간 = 5

  if( ticket === 0 && start === 0 ){
    return
  }
  else if (ticket > 0 && start === 0 ){
    return (
      <button onClick={()=>{
        setTicket(ticket - 1)
        setStart(1)
      }}>매칭 시작</button>
    )
  }

  if (start === 1){
    return(
      <div>
        <p>{ 남은시간 }</p>
        <p>예상 대기 시간 : { 예상대기시간 }분</p>
      </div>
    )

  }
};

export default WaitingRoom