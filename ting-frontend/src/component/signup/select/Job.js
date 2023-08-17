import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setJobCode } from "../../../redux/signup";

function Job(){
  let jobList = ["학생", "취준생", "전문직", 
    "회사원", "프리랜서", "공무원"];

  let dispatch = useDispatch();
  let Navigate = useNavigate();

  const changeJob = (job) => {
    dispatch(setJobCode(job));
  };

  return(
    <div className="Job">
      <h3>job</h3>
      {
          jobList.map((job, i) => {
            return (
              <button onClick={() => changeJob(job)} key={i}>{ job }</button>
              )
            }
          )
        }
      <br/>
      {/* <button onClick={() => Navigate("/signup/select/hobby")}>다음</button> */}
    </div>
  )
}

export default Job