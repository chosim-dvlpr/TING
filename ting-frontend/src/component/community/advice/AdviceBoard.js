import axios from "axios";
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

function AdviceBoard() {
  const [adviceList, setAdviceList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.userdataReducer.userdata); // Redux의 userdata 상태 가져오기

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

  // 날짜 시간 나누기
  const calculateDate = (boardTime) => {
    if (isSameDate(boardTime)) {
      return boardTime.substr(11, 5);
    } else return boardTime.substr(0, 10);
  };

  const isSameDate = (boardTime) => {
    const time = new Date(boardTime);
    const currentTime = new Date();
    return (
      time.getFullYear() === currentTime.getFullYear() &&
      time.getMonth() === currentTime.getMonth() &&
      time.getDate() === currentTime.getDate()
    );
  };

  // 케밥 게시글 닉네임과 유저 닉네임 일치하는지
  const showKebab = (nickname) => {
    return userdata && userdata.nickname === nickname;
  };

  // 글 수정
  const handleUpdate = (adviceId) => {
    navigate(`/community/advice/update/${adviceId}`);
  };

  // 글 삭제
  const handleDelete = async (adviceId) => {
    try {
      await tokenHttp.delete(`advice/${adviceId}`);
      console.log("delete성공");
      await getAllAdviceData();
    } catch (error) {
      console.error("Error deleting advice:", error);
    }
  };

  // 검색 기능 추가
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = async ({ keyword, item }) => {
    try {
      const response = await tokenHttp.get(`/advice/search/`, {
        params: {
          pageNo: currentPage,
          keyword,
          item,
        },
      });

      const searchData = response.data.data;
      setSearchResult(searchData.adviceBoardList);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  useEffect(() => {
    console.log("============search Result", searchResult);
  }, [searchResult]);

  return (
    <div className={styles.adviceBoardBackground}>
      {/* <NavBar /> */}
      <div className={styles.adviceBoardContainer}>
        <Sidebar />
        <div className={styles.adviceTopTable}>
          <SearchBar onSearch={handleSearch} />
          <button className={styles.createButton} onClick={handleCreateClick}>
            글 작성하기
          </button>
        </div>
        <div>
          <table className={styles.adviceTable}>
            <thead>
              <tr>
                <th className={styles.table_1}>Id</th>
                <th className={styles.table_2}>title</th>
                <th className={styles.table_3}>hit</th>
                <th className={styles.table_4}>createdTime</th>
              </tr>
            </thead>
            <tbody>
              {(searchResult.length > 0 ? searchResult : adviceList).map(
                (advice, index) => (
                  <tr key={advice.adviceId}>
                    <td>{advice.adviceId}</td>
                    <td>
                      <span
                        className={styles.link}
                        onClick={(event) =>
                          handleLinkClick(advice.adviceId, event)
                        }
                      >
                        {advice.title}
                      </span>
                    </td>
                    <td>{advice.hit}</td>
                    <td>
                      {advice.modifiedTime === null
                        ? calculateDate(advice.createdTime)
                        : `${calculateDate(advice.modifiedTime)} (수정됨)`}

                      {showKebab(advice.nickname) && (
                        <div className={styles.dropdownContainer}>
                          <img
                            src="/img/kebab.png"
                            alt="kebab"
                            className={styles.dropdownKebab}
                          />
                          <div className={styles.dropdownContent}>
                            <span onClick={() => handleUpdate(advice.adviceId)}>
                              Update
                            </span>
                            <span onClick={() => handleDelete(advice.adviceId)}>
                              Delete
                            </span>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
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
