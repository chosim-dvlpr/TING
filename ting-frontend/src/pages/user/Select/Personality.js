import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAddPersonalityCodeList } from "../../../redux/signup";

function Personality(){
  // 토글 구현하기
  let personalityList = ["기독교", "천주교", "불교", "원불교", 
    "이슬람교", "무교"];

  let dispatch = useDispatch();
  let Navigate = useNavigate();

  const changePersonality = (personality) => {
    dispatch(setAddPersonalityCodeList(personality));
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
      <button onClick={() => Navigate("/signup/select/style")}>다음</button>
    </div>
  )
}

export default Personality