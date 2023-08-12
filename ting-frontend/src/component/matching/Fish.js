import React from 'react';
import styles from './Fish.module.css'; // 모듈 스타일을 불러옵니다.

const FishAnimation = () => {

  return (
    <div className={styles.fishContainer}>
      <div className={styles.fish}></div>
      <div className={styles.fish2}></div>
    </div>
  );
};

export default FishAnimation;