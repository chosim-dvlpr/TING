import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIntroduce } from "../../../redux/signup";
import basicHttp from "../../../api/basicHttp";

function Introduce(){
  let [introduce, setIntroduce] = useState("");
  let dispatch = useDispatch();
  let Navigate = useNavigate();
  let signupReducer = useSelector((state) => state.signupReducer);

  const changeIntroduce = (introduce) => {
    dispatch(setIntroduce(introduce));
  };

  // 회원가입 완료 클릭 시
  // const completeSignup = () => {
  //   // dispatch(setIntroduce(introduce));
  //   let selectionData = {
  //     profileImage: signupReducer.profileImage,
  //     mbtiCode: signupReducer.mbtiCode,
  //     heightCode: signupReducer.heightCode,
  //     drinkingCode: signupReducer.drinkingCode,
  //     smokingCode: signupReducer.smokingCode,
  //     religionCode: signupReducer.religionCode,
  //     hobbyCodeList: signupReducer.hobbyCodeList,
  //     jobCode: signupReducer.jobCode,
  //     personalityCodeList: signupReducer.personalityCodeList,
  //     introduce: signupReducer.introduce,
  //     styleCodeList: signupReducer.styleCodeList,
  //   }
    
  //   let data = {
  //     email: signupReducer.email,
  //     password: signupReducer.password,
  //     name: signupReducer.name,
  //     nickname: signupReducer.nickname,
  //     phoneNumber: signupReducer.phonenumber,
  //     gender: signupReducer.gender,
  //     birth: signupReducer.birth,
  //     region: signupReducer.region,
  //     ...selectionData
  //   }
  //   basicHttp.post('/user/signup', data).then((response) => {
  //     if (response.data.code === 200) {
  //       console.log(data)
  //       alert("회원가입이 완료되었습니다.");
  //       Navigate("/login");
  //     }
  //     else if (response.data.code === 400) {
  //       alert("회원 가입 실패");
  //     }
  //   })
  // }

  return(
    <div className="Introduce">
      <h3>Introduce</h3>
      <input type="text" onChange={(e) => setIntroduce(e.target.value)}></input>
      {/* <button onClick={() => Navigate("/signup/select/profileimage")}>다음</button> */}
    </div>
  )
}

export default Introduce