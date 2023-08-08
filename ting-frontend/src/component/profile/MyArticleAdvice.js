// 상담 게시판

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux의 useSelector 임포트

import Pagination from "../community/common/Pagination";
import SearchBar from "../community/common/SearchBar";
import tokenHttp from "../../api/tokenHttp";

function MyArticleAdvice() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [myAdviceArticleList, setMyAdviceArticleList] = useState([]);

  const navigate = useNavigate();

  // 내가 쓴 상담 게시글 불러오기
  const getMyAdviceArticle = () => {
    const params = {
      pageNo: currentPage,
    }
    
    tokenHttp.get('/advice/my', { params: params }).then((response) => {
      if (response.data.code === 200) {
        console.log('성공');
        setMyAdviceArticleList(response.data.data.adviceBoardList); // 내가 쓴 게시글 데이터를 저장
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
    getMyAdviceArticle();
  }, [])


  // 페이지 이동
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h1>내가 쓴 상담 게시글</h1>
      <h3>게시글 제목을 누르면 해당 페이지로 이동</h3>
      <table>
        <thead>
          <tr>
            <th>게시글 Id</th>
            <th>Title</th>
            <th>hit</th>
            <th>createdTime</th>
          </tr>
        </thead>

        <tbody>
          {
            myAdviceArticleList ?
            myAdviceArticleList.map((article, i) => (
              <tr key={i}>
                <td>{ article.adviceId }</td>
                <td onClick={() => navigate(`/community/advice/detail/${article.adviceId}`)}>{ article.title }</td>
                <td>{ article.hit }</td>
                <td>{ article.createdTime }</td>
              </tr>
            ))
            : <p>작성된 게시글이 없다!</p>
          }
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>




      <div>


      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        />

    
      {/* <SearchBar onSearch={handleSearch} /> */}
      </div>
    </div>
  )
}

export default MyArticleAdvice;
