import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import styles from "./IssueBoard.module.css";
import Sidebar from "../common/Sidebar";
import Pagination from "../common/Pagination";
import basicHttp from "../../../api/basicHttp";
import SearchBar from "../common/SearchBar";
import NavBar from "../../common/NavBar";
import FriendButton from "../../common/FriendButton";

import Swal from "sweetalert2";

function IssueBoard() {
  const [issueList, setIssueList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState();
  const [searchItem, setSearchItem] = useState();

  const navigate = useNavigate();
  const userdata = useSelector((state) => state.userdataReducer.userdata);
  const [wheelHandlerActive, setWheelHandlerActive] = useState(true);

  const boardType = "issue";

  useEffect(() => {
    if (searchKeyword) getSearchIssueData();
    else getAllIssueData();
  }, [currentPage, searchKeyword]);

  const getAllIssueData = async () => {
    try {
      setSearchResult([]);

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

  const getSearchIssueData = async () => {
    try {
      setIssueList([]);
      const response = await basicHttp.get(`/issue/search/`, {
        params: {
          pageNo: currentPage,
          item: searchItem,
          keyword: searchKeyword,
        },
      });

      const responseData = response.data.data;
      if (responseData.issueBoardList) {
        setSearchResult(responseData.issueBoardList);
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
      Swal.fire({ title: "로그인이 필요한 \n페이지 입니다.", width: 400 });
      navigate("/login");
    }
  };

  const handleCreateClick = () => {
    if (userdata) {
      navigate("/community/issue/create");
    } else {
      Swal.fire({ title: "로그인이 필요한 \n페이지 입니다.", width: 400 });
      navigate("/login");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  //검색 기능 추가
  const [searchResult, setSearchResult] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  const handleSearch = async ({ keyword, item }) => {
    try {
      if (keyword.trim() === "") {
        setSearchClicked(false);
        setSearchKeyword(null);
        setSearchItem(null);
        return;
      }

      setSearchClicked(true);
      const response = await basicHttp.get(`/issue/search/`, {
        params: {
          pageNo: 1, // 검색 시 첫 번째 페이지부터 조회
          item,
          keyword,
        },
      });

      setSearchKeyword(keyword);
      setSearchItem(item);
      const searchData = response.data;
      setSearchResult(searchData.data.issueBoardList);
      setTotalPages(searchData.data.totalPages); // 검색 결과에 따른 totalPages 설정
      setCurrentPage(1); // 검색 시 첫 번째 페이지로 이동

      setSearchResult(searchData.data.issueBoardList);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {}, [searchResult]);

  // 투표율에 따른 배경 색 설정
  const calculateTotalCount = (issue) => issue.agreeCount + issue.opposeCount;

  const calculateRatio = (agreeCount, totalCount) =>
    totalCount === 0 ? 50 : (agreeCount / totalCount) * 100;

  const getCardStyle = (issue) => {
    const totalCount = calculateTotalCount(issue);

    const agreeRatio = calculateRatio(issue.agreeCount, totalCount);
    const opposeRatio = totalCount === 0 ? 50 : 100 - agreeRatio;

    const backgroundColor = `linear-gradient(to right, #f1b7be ${agreeRatio}%,  #8bcad5 ${agreeRatio}%)`;

    const cardStyle = {
      background: backgroundColor,
    };

    return cardStyle;
  };

  return (
    <div className={styles.issueBoardBackground}>
      <NavBar />
      {userdata && (
        <FriendButton
          toggleWheelHandler={() => setWheelHandlerActive((active) => !active)}
        />
      )}
      <div className={styles.issueBoardContainer}>
        <Sidebar />

        <div className={styles.cardTop}>
          <SearchBar onSearch={handleSearch} boardType={boardType} />
          <button className={styles.createButton} onClick={handleCreateClick}>
            글 작성하기
          </button>
        </div>

        <div className={styles.cardList}>
          {searchClicked && searchResult.length === 0 ? (
            <div className={styles.noResults}>검색 결과가 없습니다.</div>
          ) : (
            (searchResult.length > 0 ? searchResult : issueList).map(
              (issue) => (
                <div
                  key={issue.issueId}
                  className={styles.card}
                  style={getCardStyle(issue)}
                >
                  <div className={styles.cardNumContainer}>
                    <span className={styles.cardNum}>
                      {issue.agreeCount + issue.opposeCount === 0
                        ? 0
                        : Math.round(
                            (issue.agreeCount /
                              (issue.agreeCount + issue.opposeCount)) *
                              100
                          )}
                    </span>
                    <span className={styles.cardNum}>
                      {issue.agreeCount + issue.opposeCount === 0
                        ? 0
                        : Math.round(
                            (issue.opposeCount /
                              (issue.agreeCount + issue.opposeCount)) *
                              100
                          )}
                    </span>
                  </div>
                  <div className={styles.link}>
                    <div
                      onClick={(event) => handleLinkClick(issue.issueId, event)}
                      className={styles.title}
                    >
                      {issue.title}
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>

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
