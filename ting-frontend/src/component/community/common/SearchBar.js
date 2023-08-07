// SearchBar.js

import React, { useState } from 'react';
import styles from "./SearchBar.module.css";

function SearchBar({ onSearch }) {
  const [item, setItem] = useState('nickname');
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
      <option value="nickname">Nickname</option>
      <option value="title">Title</option>
    </select>

    <input className={styles.searchInput} type="text" value={keyword} onChange={handleKeywordChange} />
    <button className={styles.searchButton} onClick={handleSearch}>Search</button>
  </div>
);
}

export default SearchBar;
