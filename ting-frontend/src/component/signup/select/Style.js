import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStyleCodeList } from "../../../redux/signup";

function Style(){
  let styleList = ["기독교", "천주교", "불교", "원불교", 
  "이슬람교", "무교"];

  let dispatch = useDispatch();
  let Navigate = useNavigate();
  let signupReducer = useSelector((state) => state.signupReducer);

  const changeStyle = (style) => {
  dispatch(setStyleCodeList(style));
  };

  return(
    <div className="style">
      <h3>style</h3>
      {
          styleList.map((style, i) => {
            return (
              <button onClick={() => changeStyle(style)} key={i}>{ style }</button>
              )
            }
          )
        }
      <br/>
      { signupReducer.styleCodeList }
      {/* <button onClick={() => Navigate("/signup/select/introduction")}>다음</button> */}
    </div>
  )
}

export default Style