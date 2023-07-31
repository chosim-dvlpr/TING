import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const renderPaginationNumbers = () => {
    const pageNumbers = [];

    // 현재 페이지를 중심으로 좌우 2개의 페이지 숫자만 보여주기 위해 반복문 설정
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers.map((pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => handlePageClick(pageNumber)}
        disabled={currentPage === pageNumber}
      >
        {pageNumber}
      </button>
    ));
  };

  return (
    <div>
      <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
        이전 페이지
      </button>
      {renderPaginationNumbers()}
      <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
        다음 페이지
      </button>
    </div>
  );
};

export default Pagination;
