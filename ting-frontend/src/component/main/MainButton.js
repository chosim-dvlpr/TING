import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainButton.module.css';

const MainButton = () => {
  return (
    <div className={styles.container}>
         <Link to="/matching" className={styles.linkButton}>
        <button className={styles.btn}><span>팅</span><span>하</span><span>러</span><span>가</span><span>기</span></button>
      </Link>

    </div>
  );
};

export default MainButton;
