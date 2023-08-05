import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux의 useSelector 임포트

import styles from "./AdviceBoard.module.css";
import Sidebar from "../common/Sidebar";
import Pagination from "../common/Pagination";

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
      const response = await axios.get(
        "https://i9b107.p.ssafy.io:5157/advice",
        { params: { pageNo: currentPage } }
      );
      const responseData = response.data.data;

      if (responseData.adviceBoardList) {
        setAdviceList(responseData.adviceBoardList);
        setTotalPages(responseData.totalPages);
      }
    } catch (error) {
      console.error("Error fetching advice data:", error);
    }
  };
  //로그인 되어 있어도 로그인이 필요합니다 뜬다..
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.adviceBoardContainer}>
      <Sidebar />
      <button
        className={styles.createButton}
        onClick={() => navigate("/community/advice/create")}
      >
        글 작성하기
      </button>
      <table className={styles.adviceTable}>
        <thead>
          <tr>
            <th>Id</th>
            <th>title</th>
            <th>hit</th>
            <th>createdTime</th>
          </tr>
        </thead>
        <tbody>
          {adviceList.map((advice, index) => (
            <tr key={advice.adviceId}>
              <td>{advice.adviceId}</td>
              <td>
                <span
                  className={styles.link}
                  onClick={(event) => handleLinkClick(advice.adviceId, event)}
                >
                  {advice.title}
                </span>
              </td>
              <td>{advice.hit}</td>
              <td>{advice.createdTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AdviceBoard;
