import { useNavigate } from 'react-router-dom' 

function MainPage (){
  let Navigate = useNavigate()

  return(
    <div>
      <div>
        <h1>메인화면</h1>
        <div>이 버튼을 누르면 매칭이 진행됩니다.</div>
        <button onClick={()=>{ Navigate("/matching") }}>매칭 진행 버튼</button>
      </div>

      {/* 2페이지 */}
      <div>
        <p>
          짧고 굵게 <button onClick={()=>{ Navigate("/matching") }}>팅(로고)</button> 하러 가기
        </p>
      </div>

      <div>
        {/* 3페이지 이상 */} 
        <p>팅 설명</p>
      </div>
    </div>
  )
}

export default MainPage