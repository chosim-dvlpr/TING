// CountdownTimer.js

import React, { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';

const CountdownTimer = () => {
    const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (remainingTime > 0) {
          setRemainingTime(prevTime => prevTime - 0.001); // 1 밀리초 감소
        }
      }, 1); // 1밀리초 간격으로 실행
  
      return () => clearInterval(interval);
    }, [remainingTime]);
  
    const formatTime = time => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      const milliseconds = Math.floor((time % 1) * 1000);
      return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 100 ? '0' : ''}${milliseconds < 10 ? '0' : ''}${milliseconds < 100 ? '0' : ''}${milliseconds}`;
    };
  
    return (
      <div className={styles.countdown}>
        <span className={styles.timer}>{formatTime(remainingTime)}</span>
      </div>
    );
};

export default CountdownTimer;
