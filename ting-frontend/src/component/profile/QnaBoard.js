import { useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { useEffect, useState } from "react";

function QnaBoard() {
  const userdata = useSelector((state) => state.userdataReducer.userdata); // Redux의 userdata 상태 가져오기
  const [qnaList, setQnaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // 숫자 수정하기

  const getQnaBoard = () => {
    let params = { pageNo: currentPage }

    tokenHttp.get('/mypage/qna', { params: params }).then((response) => {
      console.log(response.data.data);
      if (response.data.code === 200) {
        console.log('성공');
        setQnaList(response.data.data); // QNA 데이터를 저장
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


  return (
    <div>
      <h1>1:1 문의 게시판</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>title</th>
            <th>hit</th>
            <th>createdTime</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  )
}

export default QnaBoard;