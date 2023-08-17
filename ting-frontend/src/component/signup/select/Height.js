import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHeightCode } from "../../../redux/signup";

function Height(){
  let dispatch = useDispatch();

  const changeHeight = (height) => {
    if (height > 100 & height < 250) {
      dispatch(setHeightCode(Number(height)));
    };
  };
  
  return(
    <div>
      <h3>Height</h3>
      <input 
        onChange={(e) => changeHeight(e.target.value)}
        type="number" min="100" max="250"></input> 
    </div>
  )
}

export default Height