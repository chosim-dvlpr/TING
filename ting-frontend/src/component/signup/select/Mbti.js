import { useDispatch } from "react-redux";
import { setMbtiCode } from "../../../redux/signup";
import { useNavigate } from "react-router-dom";

function Mbti(){
  let mbtiList = ["ISTJ", "ISFJ", "INFJ", "INTJ", 
    "ISTP", "ISFP", "INFP", "INTP", 
    "ESTP", "ESFP", "ENFP", "ENTP", 
    "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
  
  let dispatch = useDispatch();
  let Navigate = useNavigate();

  const changeMbti = (mbti) => {
    dispatch(setMbtiCode(mbti));
  };
  
  return(
    <div className="Mbti">
      <h3>MBTI</h3>
        {
          mbtiList.map((mbti, i) => {
            return (
              <button onClick={() => changeMbti(mbti)} key={i}>{ mbti }</button>
              )
            }
          )
        }
      <br/>
      <button onClick={() => Navigate("/signup/select/height")}>다음</button>
    </div>
  )
}

export default Mbti