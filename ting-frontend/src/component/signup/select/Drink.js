import { useDispatch, useSelector } from "react-redux";
import { setDrinkingCode } from "../../../redux/signup";
import Dropdown from 'react-bootstrap/Dropdown';
import { dataCode } from "../../../SelectionDataList";

function Drink(){
  // let drinkList = ["전혀 마시지 않는다", "어쩌다 한 번", "한달 1-2회",
  //   "주 1-2회", "주 3-5회", "거의 매일"];
  
  let dispatch = useDispatch();
  let signupReducer = useSelector((state) => state.signupReducer);

  const handleDropdownItemClick = (data) => {
    dispatch(setDrinkingCode(data));
  };

  return(
    <div className="Drink">
      <h3>Drink</h3>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
        { signupReducer.drinkingCode ? signupReducer.drinkingCode.name : "주량" }
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            dataCode
            .filter((data) => data.category.includes("DRINKING"))
            .map((data, i) => (
              <Dropdown.Item onClick={() => {
                handleDropdownItemClick(data)
                }}
                key={i}
              >{ data.name }</Dropdown.Item>
            ))
          }
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default Drink