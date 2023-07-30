import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAddStyleCodeList } from "../../../redux/signup";

function Style(){
  // 토글 구현하기
  let styleList = ["기독교", "천주교", "불교", "원불교", 
  "이슬람교", "무교"];

  let dispatch = useDispatch();
  let Navigate = useNavigate();

  const changeStyle = (style) => {
  dispatch(setAddStyleCodeList(style));
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
    </div>
  )
}

export default Style