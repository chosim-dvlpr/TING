import {Outlet, useNavigate} from 'react-router-dom'

function MatchingPage(){
  let Navigate = useNavigate()

  return(
    <div>
      <h1>매칭</h1>
      <button onClick={()=>{Navigate("/shop")}}>아이템샵</button>
      <button onClick={()=>{Navigate("/")}}>나가기</button>
      <Outlet></Outlet>
    </div>
  )
}

export default MatchingPage