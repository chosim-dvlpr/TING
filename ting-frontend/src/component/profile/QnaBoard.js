import { useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { useEffect, useState } from "react";
import Pagination from "../community/common/Pagination";
import { useNavigate } from "react-router-dom";

import commonStyles from "./ProfileCommon.module.css";
import styles from "./QnaBoard.module.css";
import { getDate } from "../common/TimeCalculate";

function QnaBoard() {
  const userdata = useSelector((state) => state.userdataReducer.userdata); // Redux의 userdata 상태 가져오기
  const [qnaList, setQnaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 (기본값 : 1)
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalElements, setTotalElements] = useState(0);

  const navigate = useNavigate();

  const getQnaBoard = () => {
    let params = { pageNo: currentPage };

    tokenHttp
      .get("/mypage/qna", { params: params })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.code === 200) {
          console.log("성공");
          setQnaList(response.data.data.qnaList); // QNA 데이터를 저장
          setTotalPages(response.data.data.totalPages); // 전체 페이지 저장
          setTotalElements(response.data.data.totalElements);
        } else if (response.data.code === 400) {
          console.log("실패");
        } else if (response.data.code === 403) {
          console.log("권한 없음");
        }
        // else { console.log('문의글이 없습니다.') }
      })
      .catch(() => console.log("실패"));
  };

  useEffect(() => {
    getQnaBoard();
  }, []);

  // 페이지 이동
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // qna 상세 페이지로 이동
  const goToQnaDetail = (qnaId, event) => {
    event.preventDefault();

    if (userdata) {
      navigate("/mypage/qnadetail", { state: { qnaId: qnaId } });
    } else {
      console.log("로그인 필요");
    }
  };

  // qna 작성 페이지로 이동
  const goToQnaCreate = (event) => {
    event.preventDefault();

    if (userdata) {
      navigate("/mypage/qnacreate");
    } else {
      console.log("로그인 필요");
    }
  };

  return (
    <div className={commonStyles.wrapper}>
      <div className={styles.btnWrapper}>
        <button
          className={commonStyles.btn}
          onClick={(event) => goToQnaCreate(event)}
        >
          문의 작성하기
        </button>
      </div>
      <div className={styles.innerWrapper}>
        <h3>제목을 클릭하면 상세 내용을 확인할 수 있습니다.</h3>
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성시간</th>
              <th>답변현황</th>
              <th>답변시간</th>
            </tr>
          </thead>
          <tbody>
            {qnaList.length == 0 ? (
              <td colSpan={5}>문의 내역이 없습니다.</td>
            ) : (
              qnaList.map((qna, i) => (
                <tr key={i}>
                  <td>{totalElements - 10 * (currentPage - 1) - i}</td>
                  <td>
                    <span
                      className={commonStyles.clickable}
                      onClick={(event) => goToQnaDetail(qna.qnaId, event)}
                    >
                      {qna.title}
                    </span>
                  </td>
                  <td>{getDate(qna.createdTime)}</td>
                  <td>{qna.answer ? qna.answer : "처리 전"}</td>
                  <td>
                    {qna.completedTime ? getDate(qna.completedTime) : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default QnaBoard;
