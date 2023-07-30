import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIntroduction } from "../../../redux/signup";

function Introduction(){
  let [introduction, setIntroduction] = useState("");
  let dispatch = useDispatch();
  let Navigate = useNavigate();

  const changeIntroduction = (introduction) => {
    dispatch(setIntroduction(introduction));
  };
  
  return(
    <div className="Introduction">
      <h3>Introduction</h3>
      <input type="text" onChange={(e) => setIntroduction(e.target.value)}></input>
      <button onClick={() => {
        changeIntroduction(introduction);
        Navigate("/signup/select/religion");
      }
        
        }>다음</button>      
    </div>
  )
}

export default Introduction