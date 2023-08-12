import React, { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';

const CountdownTimer = () => {
  const targetTimeMillis = 5 * 60 * 1000; // 5 minutes in milliseconds
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (elapsedTime < targetTimeMillis) {
        setElapsedTime(prevTime => prevTime + 10); // 10 milliseconds 간격으로 증가
      } else {
        setElapsedTime(0);
      }
    }, 10); // 10밀리초 간격으로 실행

    return () => clearInterval(interval);
  }, [elapsedTime]);

  const remainingTimeMillis = targetTimeMillis - elapsedTime;

  const formatTime = time => {
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);
    const milliseconds = time % 1000;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 100 ? '0' : ''}${milliseconds < 10 ? '0' : ''}${milliseconds}`;
  };

  return (
    <div className={styles.countdown}>
      <span className={styles.timer}>{formatTime(remainingTimeMillis)}</span>
    </div>
  );
};

export default CountdownTimer;
