import { useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import commonStyles from "./ProfileCommon.module.css";
import styles from "./QnaBoard.module.css";

function QnaDetail() {
  const location = useLocation();

  const userdata = useSelector((state) => state.userdataReducer.userdata); // Redux의 userdata 상태 가져오기
  const qnaId = Number(location.state.qnaId);
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
    <div className={commonStyles.wrapper}>
      <div className={styles.detailWrapper}>
        <table>
          <tr><th>번호</th> <td>{qnaDetail.qnaId}</td></tr>
          <tr><th>제목</th> <td>{qnaDetail.title}</td></tr>
          <tr><th>작성시간</th> <td>{qnaDetail.createdTime}</td></tr>
          <tr><th>내용</th> <td>{qnaDetail.content}</td></tr>
        </table>
      </div>
      <br />
      {qnaDetail.answer ?
        <div className={styles.detailWrapper}>
          <h4>답변({qnaDetail.completedTime})</h4>
          <div className={styles.answerDiv}>{qnaDetail.answer}답변답변</div>
        </div> :
        <div className={styles.detailWrapper}>
          <h4>아직 답변이 등록되지 않았습니다.</h4>
        </div>
      }
    </div >
  )
}

export default QnaDetail