import React, { useState } from 'react';
import styles from "./SearchBar.module.css";

function SearchBar({ onSearch, boardType }) {
  const [item, setItem] = useState('title');
  const [keyword, setKeyword] = useState('');

  const handleItemChange = (event) => {
    setItem(event.target.value);
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = () => {
    if (keyword.trim() !== '') {
      console.log("Search button clicked");
      onSearch({ keyword, item });
    } else {
      console.log("Empty search keyword, not searching.");
      alert("검색어를 입력해주세요.");
    }
  };

  // 엔터 검색 처리

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      {boardType === "issue" && (
        <select className={styles.searchInput} value={item} onChange={handleItemChange}>
          <option value="title">제목</option>
          <option value="nickname">닉네임</option>
        </select>
      )}
      {boardType === "advice" && (
        <div value="title" className={styles.searchInput}>제목</div>
      )}
      <input
        className={styles.searchInput}
        type="text"
        value={keyword}
        onChange={handleKeywordChange}
        onKeyPress={handleKeyPress}
      />
      <button className={styles.searchButton} onClick={handleSearch}>검색</button>
    </div>
  );
}

export default SearchBar;
