import React from "react";
import { useEffect, useState } from "react";
import styles from "./Pagination.module.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [tenth, setTenth] = useState();
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    setTenth(Math.floor((currentPage - 1) / 10) * 10);
  }, [currentPage]);

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
          onClick={() => {
            onPageChange(tenth - 9);
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
              onClick={() => {
                onPageChange(tenth + num);
              }}
            >
              {tenth + num}
            </button>
          )
      )}
      {tenth + 10 < totalPages ? (
        <button
          className={styles.btn}
          id="nextBtn"
          onClick={() => {
            onPageChange(tenth + 11);
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
