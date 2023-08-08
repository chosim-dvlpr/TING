import { useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { useEffect, useState } from "react";

function QnaDetail() {
  const userdata = useSelector((state) => state.userdataReducer.userdata); // Redux의 userdata 상태 가져오기
  const [qnaId, setQndId] = useState(7); // qua ID 바꾸기
  const [qnaDetail, setQnaDetail] = useState([]);

  // QNA 상세 조회 API 불러오기
  const getQnaDetail = () => {
    tokenHttp.get(`/mypage/qna/${qnaId}`).then((response) => {
      console.log(response);
      if (response.data.code === 200) {
        console.log('성공');
        setQnaDetail(response.data.data); // 상세 QNA 데이터를 저장
      }
      else if (response.data.code === 400) {
        console.log('실패');
      }
      else if (response.data.code === 403) {
        console.log('권한 없음');
      }
      else { console.log('문의글이 없습니다.') }
    })
    .catch(() => console.log("실패"));
  };

  // 렌더링 시 게시글 불러오기
  useEffect(() => {
    getQnaDetail();
  }, [])

  return (
    <div>
      <h1>문의 상세</h1>
      <p>qnaId: { qnaDetail.qnaId }</p>
      <p>title: { qnaDetail.title }</p>
      <p>content: { qnaDetail.content }</p>
      <p>createdTime: { qnaDetail.createdTime }</p>
      <br/>
      <p>answer: { qnaDetail.answer }</p>
      <p>completedTime: { qnaDetail.completedTime }</p>
    </div>
  )
}

export default QnaDetail