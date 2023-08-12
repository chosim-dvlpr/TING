import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHeightCode } from "../../../redux/signup";

function Height(){
  let heightList = ["160-169", "170-179", "180-185", "185 이상"];

  let dispatch = useDispatch();
  let Navigate = useNavigate();


  const changeHeight = (height) => {
    dispatch(setHeightCode(height));
  };
  
  return(
    <div className="Height">
      <h3>Height</h3>
      <input type="number"></input> 
      {/* {
        heightList.map((height, i) => {
          return (
            <button onClick={() => changeHeight(height)} key={i}>{ height }</button>
          )
        })
      } */}
      <br/>
      {/* <button onClick={() => Navigate("/signup/select/drink")}>다음</button> */}
    </div>
  )
}

export default Height