import { useDispatch } from "react-redux";
import { setMbtiCode } from "../../../redux/signup";

function Mbti(){
  let mbtiList = ["ISTJ", "ISFJ", "INFJ", "INTJ", 
    "ISTP", "ISFP", "INFP", "INTP", 
    "ESTP", "ESFP", "ENFP", "ENTP", 
    "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
  
  let dispatch = useDispatch();
  
  return(
    <div className="Mbti">
      <h3>MBTI</h3>
        {
          mbtiList.map((mbti, i) => {
            return (
              <button onClick={dispatch(setMbtiCode(mbti))}>{ mbti }</button>
              )
            }
          )
        }
        
    </div>
  )
}

export default Mbti