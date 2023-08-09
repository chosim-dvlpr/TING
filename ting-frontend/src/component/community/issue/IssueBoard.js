import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./IssueBoard.module.css";
import Sidebar from "../common/Sidebar";
import Pagination from "../common/Pagination";
import tokenHttp from "../../../api/tokenHttp";
import basicHttp from "../../../api/basicHttp";
import SearchBar from "../common/SearchBar";
import NavBar from "../../common/NavBar";

function IssueBoard() {
  const [issueList, setIssueList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.userdataReducer.userdata);

  const boardType = "issue";

  useEffect(() => {
    getAllIssueData();
  }, [currentPage]);

  const getAllIssueData = async () => {
    try {
      const response = await basicHttp.get("/issue", {
        params: { pageNo: currentPage },
      });
      const responseData = response.data.data;

      if (responseData.issueBoardList) {
        setIssueList(responseData.issueBoardList);
        setTotalPages(responseData.totalPages);
      }
    } catch (error) {
      console.error("Error fetching issue data:", error);
    }
  };

  const handleLinkClick = (issueId, event) => {
    event.preventDefault();
    if (userdata) {
      navigate(`/community/issue/detail/${issueId}`);
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const handleCreateClick = () => {
    if (userdata) {
      navigate("/community/issue/create");
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };




  //검색 기능 추가
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = async ({ keyword, item }) => {
    try {
      const response = await tokenHttp.get(`/issue/search/`, {
        params: {
          pageNo: currentPage,
          item,
          keyword,
        },
      });

      const searchData = response.data;
      console.log("===========Search Data:", searchData);

      console.log("============", searchData.issueBoardList);
      setSearchResult(searchData.data.issueBoardList);

      console.log("============Search Result:", searchResult);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  useEffect(() => {
    console.log("============Search Result:", searchResult);
  }, [searchResult]);

  return (
    <div>

      {/* <NavBar/> */}
     
        
      <div className={styles.issueBoardContainer}>

      <NavBar/>

      <Sidebar />
      <div className={styles.cardList}>
      <button className={styles.createButton} onClick={handleCreateClick}>
            글 작성하기
          </button>
        
        {searchResult.length > 0
          ? searchResult.map((issue) => (
            <div key={issue.issueId} className={styles.card}>
                <span
                  className={styles.link}
                  onClick={(event) => handleLinkClick(issue.issueId, event)}
                >
                  {issue.title}
                </span>
                <div className={styles.cardFooter}>
                  <div className={styles.cardVotes}>
                    <div className={styles.agree}>
                      <span>{issue.agree_title}</span>
                      <span>{issue.agree_count}</span>
                    </div>
                    <div className={styles.oppose}>
                      <span>{issue.oppose_title}</span>
                      <span>{issue.oppose_count}</span>
                    </div>
                  </div>
          
                </div>
              </div>
            ))
            : issueList.map((issue) => (
              <div key={issue.issueId} className={styles.card}>
                <span
                  className={styles.link}
                  onClick={(event) => handleLinkClick(issue.issueId, event)}
                >
                  {issue.title}
                </span>
                <div className={styles.cardFooter}>
                  <div className={styles.cardVotes}>
                    <div className={styles.agree}>
                      <span>{issue.agree_title}</span>
                      <span>{issue.agree_count}</span>
                    </div>
                    <div className={styles.oppose}>
                      <span>{issue.oppose_title}</span>
                      <span>{issue.oppose_count}</span>
                    </div>
                  </div>
              
                </div>
              </div>
            ))}
      </div>
            <SearchBar onSearch={handleSearch} boardType={boardType}/>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      </div>
     
    </div>
  );
}

export default IssueBoard;