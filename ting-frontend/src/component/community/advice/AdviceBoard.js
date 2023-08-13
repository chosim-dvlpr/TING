import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux의 useSelector 임포트

import styles from "./AdviceBoard.module.css";
import Sidebar from "../common/Sidebar";

import Pagination from "../common/Pagination";
import tokenHttp from "../../../api/tokenHttp";
import basicHttp from "../../../api/basicHttp";
import SearchBar from "../common/SearchBar";
import NavBar from "../../common/NavBar";

import { getDate } from "../../common/TimeCalculate";

function AdviceBoard() {
  const [adviceList, setAdviceList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.userdataReducer.userdata); // Redux의 userdata 상태 가져오기

  const boardType = "advice";

  useEffect(() => {
    getAllAdviceData();
  }, [currentPage]);

  const getAllAdviceData = async () => {
    try {
      const response = await basicHttp.get("/advice", {
        params: { pageNo: currentPage },
      });
      const responseData = response.data.data;
      console.log(responseData);

      if (responseData.adviceBoardList) {
        setAdviceList(responseData.adviceBoardList);
        setTotalPages(responseData.totalPages);
      }
    } catch (error) {
      console.error("Error fetching advice data:", error);
    }
  };

  const handleLinkClick = (adviceId, event) => {
    event.preventDefault();
    console.log("handleLinkClick called");
    console.log(userdata);
    if (userdata) {
      console.log(userdata);
      navigate(`/community/advice/detail/${adviceId}`);
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const handleCreateClick = () => {
    if (userdata) {
      navigate("/community/advice/create");
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 검색 기능 추가
  const [searchResult, setSearchResult] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  const handleSearch = async ({ keyword }) => {
    try {
      setSearchClicked(true);
      const response = await tokenHttp.get(`/advice/search/`, {
        params: {
          pageNo: 1, // 검색 시 첫 번째 페이지부터 조회
          keyword,
        },
      });

      const searchData = response.data.data;
      setSearchResult(searchData.adviceBoardList);
      setTotalPages(searchData.totalPages); // 검색 결과에 따른 totalPages 설정
      setCurrentPage(1); // 검색 시 첫 번째 페이지로 이동
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    console.log("============search Result", searchResult);
  }, [searchResult]);

  // ... (이전 코드)

  return (
    <div className={styles.adviceBoardBackground}>
      <NavBar />
      <div className={styles.adviceBoardContainer}>
        <Sidebar />
        <div className={styles.adviceTopTable}>
          <SearchBar onSearch={handleSearch} boardType={boardType} />
          <button className={styles.createButton} onClick={handleCreateClick}>
            글 작성하기
          </button>
        </div>
        <div>
          <table className={styles.adviceTable}>
            <tbody>
              {searchClicked && searchResult.length === 0 ? (
                <div>검색 결과가 없습니다.</div>
              ) : (
                (searchResult.length > 0 ? searchResult : adviceList).map(
                  (advice, index) => (
                    <tr key={advice.adviceId}>
                      <td className={styles.table_1}>{advice.adviceId}</td>
                      <td className={styles.table_2}>
                        <span
                          className={styles.link}
                          onClick={(event) =>
                            handleLinkClick(advice.adviceId, event)
                          }
                        >
                          {advice.title}
                        </span>
                      </td>
                      <td className={styles.table_3}>{advice.hit}</td>
                      <td className={styles.table_4}>
                        {advice.modifiedTime === null
                          ? getDate(advice.createdTime)
                          : `${getDate(advice.modifiedTime)}`}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
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

export default AdviceBoard;
