import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSmokingCode } from "../../../redux/signup";

function Smoke(){
  let smokingList = ["전혀 하지 않는다", "어쩌다 한 번", "하루 1-2개피",
    "하루 5개피", "하루 반 갑", "하루 한 갑 이상"];

  let dispatch = useDispatch();
  let Navigate = useNavigate();

  const changeSmoking = (smoking) => {
    dispatch(setSmokingCode(smoking));
  };

  return(
    <div className="Smoke">
      <h3>smoking</h3>
      {
          smokingList.map((smoking, i) => {
            return (
              <button onClick={() => changeSmoking(smoking)} key={i}>{ smoking }</button>
              )
            }
          )
        }
      <br/>
      {/* <button onClick={() => Navigate("/signup/select/religion")}>다음</button>       */}
    </div>
  )
}

export default Smoke