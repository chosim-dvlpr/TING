// 상담 게시판

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux의 useSelector 임포트

import Pagination from "../community/common/Pagination";
import tokenHttp from "../../api/tokenHttp";

import commonStyles from "./ProfileCommon.module.css";
import styles from "./MyArticle.module.css";
import { getDate } from "../common/TimeCalculate";

function MyArticleIssue() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [myIssueArticleList, setMyIssueArticleList] = useState([]);
  const userdata = useSelector((state) => state.userdataReducer.userdata);

  const navigate = useNavigate();

  // 내가 쓴 상담 게시글 불러오기
  const getMyIssueArticle = () => {
    const params = {
      pageNo: currentPage,
      item: "nickname",
      keyword: userdata.nickname,
    };

    tokenHttp
      .get("/issue/search", { params: params })
      .then((response) => {
        if (response.data.code === 200) {
          setMyIssueArticleList(response.data.data.issueBoardList); // 내가 쓴 게시글 데이터를 저장
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
    getMyIssueArticle();
  }, [currentPage]);

  // 페이지 이동
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.innerWrapper}>
      <h3>게시글 제목을 누르면 해당 페이지로 이동합니다.</h3>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>조회수</th>
            <th>작성시간</th>
          </tr>
        </thead>

        <tbody>
          {myIssueArticleList.length > 0 ? (
            myIssueArticleList.map((article, i) => (
              <tr key={i}>
                <td>{totalElements - 5 * (currentPage - 1) - i}</td>
                <td
                  className={commonStyles.clickable}
                  onClick={() =>
                    navigate(`/community/issue/detail/${article.issueId}`)
                  }
                >
                  {article.title}
                </td>
                <td>{article.hit}</td>
                <td>{getDate(article.createdTime)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>작성한 게시글이 없습니다.</td>
            </tr>
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
  );
}

export default MyArticleIssue;
