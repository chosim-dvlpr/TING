import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPersonalityCodeList } from "../../../redux/signup";

function Personality(){
  let personalityList = ["기독교", "천주교", "불교", "원불교", 
    "이슬람교", "무교"];

  let dispatch = useDispatch();
  let Navigate = useNavigate();
  let signupReducer = useSelector((state) => state.signupReducer);

  const changePersonality = (personality) => {
    dispatch(setPersonalityCodeList(personality));
  };

  return(
    <div className="Personality">
      <h3>personality</h3>
      {
          personalityList.map((personality, i) => {
            return (
              <button onClick={() => changePersonality(personality)} key={i}>{ personality }</button>
              )
            }
          )
        }
      <br/>
      { signupReducer.personalityCodeList }
      {/* <button onClick={() => Navigate("/signup/select/style")}>다음</button> */}
    </div>
  )
}

export default Personality