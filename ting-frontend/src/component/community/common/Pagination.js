import React from "react";
import { useEffect, useState } from "react";
import styles from "./Pagination.module.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
    const [currentClick, setCurrentClick] = useState(0);
    const [prevClick, setPrevClick] = useState(null);

    useEffect((e) => {
        if(currentClick != null) {
          let current = document.getElementById(currentClick);
          current.style.backgroundColor = "#d75c6b";
          // current.style.borderBottom = "2px solid black";
        }
        if(prevClick != null) {
          let prev = document.getElementById(prevClick);
          prev.style.backgroundColor = "#e58490";
          // prev.style.borderBottom = "none";
        }
        setPrevClick(currentClick);
      },[currentClick])

    const getClick = (e) => {
        console.log(e.target.id);
    setCurrentClick(e.target.id);
    }

    return (
        <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    id={index}
                    key={index + 1}
                    className={currentPage === index + 1 ? styles.activePage : styles.page}
                    onClick={(e) => {onPageChange(index + 1); getClick(e);}}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );
}

export default Pagination;
