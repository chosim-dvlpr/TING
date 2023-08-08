import { useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { useEffect, useState } from "react";
import Pagination from "../community/common/Pagination";
import { useNavigate } from "react-router-dom";

function QnaBoard() {
  const userdata = useSelector((state) => state.userdataReducer.userdata); // Redux의 userdata 상태 가져오기
  const [qnaList, setQnaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 (기본값 : 1)
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  const navigate = useNavigate();

  const getQnaBoard = () => {
    let params = { pageNo: currentPage }

    tokenHttp.get('/mypage/qna', { params: params }).then((response) => {
      console.log(response.data.data);
      if (response.data.code === 200) {
        console.log('성공');
        setQnaList(response.data.data.qnaList); // QNA 데이터를 저장
        setTotalPages(response.data.data.totalPages); // 전체 페이지 저장
      }
      else if (response.data.code === 400) {
        console.log('실패');
      }
      else if (response.data.code === 403) {
        console.log('권한 없음');
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
    console.log('===========')
    if (userdata) {
      navigate("/mypage/qnadetail", { state: { qnaId: qnaId } });
    }
    else {
      console.log('로그인 필요');
    }
  };


  return (
    <div style={{ margin: 'auto', width: '50%' }}>
      <h1>1:1 문의 게시판</h1>
      <h3>제목을 클릭하면 상세페이지로 넘어가요!</h3>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>title</th>
            <th>createdTime</th>
            <th>answer</th>
            <th>completedTime</th>
          </tr>
        </thead>
        <tbody>
          {
            qnaList.map((qna, i) => (
            <tr key={i}>
              <td>{ qna.qnaId }</td>
              <td>
                <span onClick={(event) => goToQnaDetail(qna.qnaId, event)}>{ qna.title }</span>
              </td>
              <td>{ qna.createdTime }</td>
              <td>{ qna.answer ? qna.answer : '처리 전' }</td>
              <td>{ qna.completedTime ? qna.completedTime : '-' }</td>
            </tr>  
            ))
          }
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
  )
}

export default QnaBoard;