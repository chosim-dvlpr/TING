import React from "react";
import { useEffect, useState } from "react";
import styles from "./Pagination.module.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
    const [currentClick, setCurrentClick] = useState(0);
    const [prevClick, setPrevClick] = useState(null);
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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

    const check = (currentPage, index, totalPages) => {
        if(((Math.floor(currentPage/10))*10 + index + 1) > totalPages) return false;
        return true;
    }

    return (
        <div className={styles.pagination}>
            {Math.floor(currentPage/10)*10 > 0? <button>{"<<"}</button>: ""}
            {arr.map((num, index) => (
                    check(currentPage, index, totalPages) &&
                    (<button
                        id={index}
                        key={index + 1}
                        className={currentPage === index + 1 ? styles.activePage : styles.page}
                        onClick={(e) => {onPageChange(index + 1); getClick(e);}}
                    >
                        {(Math.floor(currentPage/10))*10 + index + 1}
                    </button>)
            ))}
            {(Math.floor(currentPage/10)+1)*10 < totalPages? <button>{">>"}</button>: ""}
        </div>
    );
}

export default Pagination;
