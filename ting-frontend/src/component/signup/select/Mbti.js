import { useDispatch, useSelector } from "react-redux";
import { setMbtiCode } from "../../../redux/signup";
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { dataCode } from "../../../SelectionDataList";

function Mbti(){
  let dispatch = useDispatch();
  let signupReducer = useSelector((state) => state.signupReducer);

  const handleDropdownItemClick = (data) => {
    dispatch(setMbtiCode(data));
  };
  
  return(
    <div className="Mbti">
      <h3>MBTI</h3>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
        { signupReducer.mbtiCode ? signupReducer.mbtiCode.name : "MBTI" }
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            dataCode
            .filter((data, i) => data.category.includes("MBTI"))
            .map((data) => (
              <Dropdown.Item onClick={() => {
                handleDropdownItemClick(data)
              }
                }>{ data.name }</Dropdown.Item>
            ))
          }
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default Mbti