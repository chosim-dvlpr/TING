import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIntroduce, setProfileImage } from "../../../redux/signup";
import basicHttp from "../../../api/basicHttp";
import fileHttp from "../../../api/fileHttp";

function ProfileImage(){
  let [introduce, setIntroduce] = useState("");
  let dispatch = useDispatch();
  let Navigate = useNavigate();
  let signupReducer = useSelector((state) => state.signupReducer);

  let uploadImage = useState("");

  // api 요청 확인 - 순서 : 유저 데이터 먼저 전달 후 성공 시 파일 보내기
  // 파일 제외한 요청 확인 : 1이면 성공
  let [checkData, setCheckData] = useState(0); 

  const formData = new FormData();

  // 사용자 정보 같이 보내기
  const value = [{
    email: signupReducer.email,
    password: signupReducer.password,
  }];
  
  // 회원가입 완료 클릭 시
  const dataAxios = () => {
    // dispatch(setIntroduce(introduce));
    let selectionData = {
      mbtiCode: signupReducer.mbtiCode,
      heightCode: signupReducer.heightCode,
      drinkingCode: signupReducer.drinkingCode,
      smokingCode: signupReducer.smokingCode,
      religionCode: signupReducer.religionCode,
      hobbyCodeList: signupReducer.hobbyCodeList,
      jobCode: signupReducer.jobCode,
      personalityCodeList: signupReducer.personalityCodeList,
      introduce: signupReducer.introduce,
      styleCodeList: signupReducer.styleCodeList,
    }
    
    let data = {
      email: signupReducer.email,
      password: signupReducer.password,
      name: signupReducer.name,
      nickname: signupReducer.nickname,
      phoneNumber: signupReducer.phonenumber,
      gender: signupReducer.gender,
      birth: signupReducer.birth,
      region: signupReducer.region,
      ...selectionData
    }
    // 회원가입 데이터 보내기
    basicHttp.post('/user/signup', data).then((response) => {
      if (response.data.code === 200) {
        setCheckData(1);
        console.log('회원가입 데이터 전달 성공');
      }
      else if (response.data.code === 400) {
        alert("회원 정보 업로드 실패");
      }
    })
  }

  // 파일 업로드
  // 업로드된 이미지 보낼 때 이메일, 비밀번호 함께 보내기 (유저 확인)
  const onUploadImage = (e) => {
    e.preventDefault();

    if (!e.target.files) {
      return;
    }

    formData.append('image', e.target.files[0]);

    const blob = new Blob([JSON.stringify(value)], {type: "application/json"}) 
    formData.append("data", blob)
  }

  // 파일 api 보내기
  const fileAxios = () => {
    fileHttp.post('', formData).then((response) => {
      console.log(response);
      if (response.data.code === 200) {
        // setCheckDataList([...checkDataList[0], 1]);
        alert("회원가입이 완료되었습니다.");
        Navigate("/login");
      }
      else {
        console.log('파일 업로드 실패')
      }
    });
  }


  // 데이터, 파일 모두 확인되었다면 로그인 완료 팝업 띄우고 페이지 이동


  useEffect(() => {
    // checkData();
    if (checkData === 1) {
      fileAxios();
    }
  }, [checkData])

  return(
    <div className="Introduce">
      <div>
        <h3>프로필 사진을 업로드해주세요!</h3>
        <input type="file" accept='image/*' onChange={onUploadImage}></input>
      </div>
      <div>
        <button onClick={() => dataAxios()}>로그인 하러 가기</button>
      </div>
    </div>
  )
}

export default ProfileImage;