import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDrinkingCode } from "../../../redux/signup";

function Drink(){
  let drinkList = ["전혀 마시지 않는다", "어쩌다 한 번", "한달 1-2회",
    "주 1-2회", "주 3-5회", "거의 매일"];
  
  let dispatch = useDispatch();
  let Navigate = useNavigate();
  
  const changeDrink = (drink) => {
    dispatch(setDrinkingCode(drink));
  };

  return(
    <div className="Drink">
      <h3>Drink</h3>
      {
          drinkList.map((drink, i) => {
            return (
              <button onClick={() => changeDrink(drink)} key={i}>{ drink }</button>
              )
            }
          )
        }
      <br/>
      <button onClick={() => Navigate("/signup/select/smoke")}>다음</button>
    </div>
  )
}

export default Drink