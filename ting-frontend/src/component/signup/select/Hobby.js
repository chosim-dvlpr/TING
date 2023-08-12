import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHobbyCodeList } from "../../../redux/signup";

function Hobby(){
  // 토글 구현하기
  let hobbyList = ["기독교", "천주교", "불교", "원불교", 
    "이슬람교", "무교"];

  let dispatch = useDispatch();
  let Navigate = useNavigate();
  // let signupReducer = useSelector((state) => state.signupReducer);

  const addHobby = (hobby) => {
    dispatch(setHobbyCodeList(hobby));
  };

  return(
    <div className="Hobby">
      <h3>hobby</h3>
      {
          hobbyList.map((hobby, i) => {
            return (
              <button onClick={() => addHobby(hobby)} key={i}>{ hobby }</button>
              )
            }
          )
        }
      <br/>
      {/* <button onClick={() => Navigate("/signup/select/personality")}>다음</button> */}
    </div>
  )
}
  
export default Hobby