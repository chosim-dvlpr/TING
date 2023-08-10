// SearchBar.js

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
    console.log("Search button clicked");
    onSearch({ keyword, item });
  };
  

  return (
    <div className={styles.searchBarContainer}>
      <select className={styles.searchInput} value={item} onChange={handleItemChange}>
      {boardType === "issue" && (
          <>
            <option value="title">제목</option>
            <option value="nickname">닉네임</option>
          </>
        )}
        {boardType === "advice" && (
          <option value="title">Title</option>
        )}
      </select>
    <input className={styles.searchInput} type="text" value={keyword} onChange={handleKeywordChange} />
    <button className={styles.searchButton} onClick={handleSearch}>Search</button>
  </div>
);
}

export default SearchBar;
