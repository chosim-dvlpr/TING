import { Outlet } from "react-router-dom"

function SelectionData(){
  return(
    <div>
      <h3>추가 정보 입력</h3>
      <Outlet></Outlet>
    </div>
  )
}

export default SelectionData