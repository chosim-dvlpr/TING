import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux의 useSelector 임포트

import styles from "./AdviceBoard.module.css";
import Sidebar from "../common/Sidebar";
import Pagination from "../common/Pagination";
import tokenHttp from "../../../api/tokenHttp";
import basicHttp from "../../../api/basicHttp";

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
      const response = await basicHttp.get(
        "/advice",
        { params: { pageNo: currentPage} }
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
        console.log("delete성공")
        await getAllAdviceData(); 
      } catch (error) {
        console.error("Error deleting advice:", error);
      }
    };

  return (
    <div className={styles.adviceBoardContainer}>
      <Sidebar />
      <button className={styles.createButton} onClick={handleCreateClick}>
        글 작성하기</button>

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
              <td> {advice.modifiedTime ? (
                  <>
              {advice.modifiedTime} (수정됨)
              </>
        ) : (
          advice.createdTime
        )}
              {showKebab(advice.nickname) && (
                <div className={styles.dropdownContainer}>
                <img src="/img/kebab.png" alt="kebab" className={styles.dropdownKebab}/>
                <div className={styles.dropdownContent}>
                  <span onClick={() => handleUpdate(advice.adviceId)}>Update</span>
                  <span onClick={() => handleDelete(advice.adviceId)}>Delete</span>
                </div>
              </div>
            )}
  
              </td>
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
