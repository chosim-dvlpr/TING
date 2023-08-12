import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setReligionCode } from "../../../redux/signup";

function Religion(){
  let religionList = ["기독교", "천주교", "불교", "원불교", 
    "이슬람교", "무교"];

  let dispatch = useDispatch();
  let Navigate = useNavigate();

  const changeReligion = (religion) => {
    dispatch(setReligionCode(religion));
  };

  return(
    <div className="Religion">
      <h3>religion</h3>
      {
          religionList.map((religion, i) => {
            return (
              <button onClick={() => changeReligion(religion)} key={i}>{ religion }</button>
              )
            }
          )
        }
      <br/>
      {/* <button onClick={() => Navigate("/signup/select/job")}>다음</button> */}
    </div>
  )
}

export default Religion