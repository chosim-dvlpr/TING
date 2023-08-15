import React from "react";
import { useEffect, useState } from "react";
import styles from "./Pagination.module.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [currentClick, setCurrentClick] = useState(0);
  const [prevClick, setPrevClick] = useState(null);
  const [tenth, setTenth] = useState();
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    console.log(currentPage);
    setTenth(Math.floor((currentPage - 1) / 10) * 10);
    console.log("tenth", tenth);
  }, [currentPage]);

  const getClick = (e) => {
    console.log(e.target.id);
    setCurrentClick(e.target.id);
  };

  const check = (index, totalPages) => {
    if (tenth + index + 1 > totalPages) return false;
    return true;
  };

  return (
    <div className={styles.pagination}>
      {tenth > 0 ? (
        <button
          className={styles.btn}
          id="prevBtn"
          onClick={(e) => {
            onPageChange(tenth - 9);
            getClick(e);
          }}
        >
          {"<<"}
        </button>
      ) : (
        ""
      )}
      {arr.map(
        (num, index) =>
          check(index, totalPages) && (
            <button
              id={index}
              key={index + 1}
              className={
                currentPage === tenth + num ? styles.activePage : styles.page
              }
              onClick={(e) => {
                onPageChange(tenth + num);
                getClick(e);
              }}
            >
              {tenth + num}
            </button>
          )
      )}
      {tenth + 11 < totalPages ? (
        <button
          className={styles.btn}
          id="nextBtn"
          onClick={(e) => {
            onPageChange(tenth + 11);
            getClick(e);
          }}
        >
          {">>"}
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default Pagination;
