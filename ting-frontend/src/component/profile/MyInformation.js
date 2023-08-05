import { useSelector } from "react-redux";

function MyInformation() {
  let userdata = useSelector((state) => state.userdataReducer);

  return (
    <div>
      <h2>내 정보 페이지</h2>
      <p>이름 : {userdata.name }</p>
    </div>
  )
}

export default MyInformation