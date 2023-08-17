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
import FriendButton from "../../common/FriendButton";

import { getDate } from "../../common/TimeCalculate";
import Swal from "sweetalert2";

function AdviceBoard() {
  const [adviceList, setAdviceList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState();
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.userdataReducer.userdata); // Redux의 userdata 상태 가져오기
  const [wheelHandlerActive, setWheelHandlerActive] = useState(true);

  const boardType = "advice";

  useEffect(() => {
    if (searchKeyword) getSearchAdviceData();
    else getAllAdviceData();
  }, [currentPage, searchKeyword]);

  const getAllAdviceData = async () => {
    try {
      setSearchResult([]);

      const response = await basicHttp.get("/advice", {
        params: { pageNo: currentPage },
      });
      const responseData = response.data.data;

      if (responseData.adviceBoardList) {
        setAdviceList(responseData.adviceBoardList);
        setTotalPages(responseData.totalPages);
        setTotalElements(responseData.totalElements);
      }
    } catch (error) {
      console.error("Error fetching advice data:", error);
    }
  };

  const getSearchAdviceData = async () => {
    try {
      setAdviceList([]);

      const response = await tokenHttp.get(`/advice/search/`, {
        params: {
          pageNo: currentPage,
          keyword: searchKeyword,
        },
      });

      const responseData = response.data.data;
      if (responseData.adviceBoardList) {
        setSearchResult(responseData.adviceBoardList);
        setTotalPages(responseData.totalPages);
        setTotalElements(responseData.totalElements);
      }
    } catch (error) {
      console.error("Error fetching advice data:", error);
    }
  };

  const handleLinkClick = (adviceId, event) => {
    event.preventDefault();

    if (userdata) {
      navigate(`/community/advice/detail/${adviceId}`);
    } else {
      Swal.fire({ title: "로그인이 필요한 \n페이지 입니다.", width: 400 });
      navigate("/login");
    }
  };

  const handleCreateClick = () => {
    if (userdata) {
      navigate("/community/advice/create");
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

  // 검색 기능 추가
  const [searchResult, setSearchResult] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  const handleSearch = async ({ keyword }) => {
    try {
      if (keyword.trim() === "") {
        setSearchClicked(false);
        setSearchKeyword(null);
        return;
      }

      setSearchClicked(true);
      const response = await tokenHttp.get(`/advice/search/`, {
        params: {
          pageNo: 1, // 검색 시 첫 번째 페이지부터 조회
          keyword,
        },
      });

      setSearchKeyword(keyword);
      const searchData = response.data.data;
      setSearchResult(searchData.adviceBoardList);
      setTotalPages(searchData.totalPages); // 검색 결과에 따른 totalPages 설정
      setTotalElements(searchData.totalElements);
      setCurrentPage(1); // 검색 시 첫 번째 페이지로 이동
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {}, [searchResult]);

  return (
    <div className={styles.adviceBoardBackground}>
      <NavBar />
      {userdata && (
        <FriendButton
          toggleWheelHandler={() => setWheelHandlerActive((active) => !active)}
        />
      )}
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
            <thead>
              <tr>
                <th className={styles.tableHeader_1}>번호</th>
                <th className={styles.tableHeader_2}>제목</th>
                <th className={styles.tableHeader_3}>조회수</th>
                <th className={styles.tableHeader_4}>날짜</th>
              </tr>
            </thead>
            <tbody>
              {searchClicked && searchResult.length === 0 ? (
                <tr>
                  <td colSpan={4} id={styles.noResult}>
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                (searchResult.length > 0 ? searchResult : adviceList).map(
                  (advice, index) => (
                    <tr key={advice.adviceId}>
                      <td className={styles.table_1}>
                        {totalElements - 10 * (currentPage - 1) - index}
                      </td>
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
                        {getDate(advice.createdTime)}
                        {/* {advice.modifiedTime === null
                          ? getDate(advice.createdTime)
                          : `${getDate(advice.modifiedTime)}`} */}
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
