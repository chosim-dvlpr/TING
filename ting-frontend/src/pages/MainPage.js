import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {FullPage, Slide } from 'react-full-page';
import AOS from "aos";
import "./aos.css";
import styles from './MainPage.module.css';

function MainPage() {

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
    return () => {
      AOS.refresh(); // 컴포넌트가 언마운트될 때 AOS를 해제합니다.
    };
  }, []);

  return (
    <FullPage>
      {/* 첫 번째 섹션 - 풀페이지 영상 */}
      <Slide>
        <div className={styles.fullPageVideo}>
          {/* 영상을 넣을 Video 태그 등 추가 */}
          <h1>메인 페이지!</h1>
        </div>
      </Slide>

      {/* 두 번째 섹션 - 프로젝트 설명 */}
      <Slide>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>메인화면</h1>
            <div data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1500">
              <h1>이거 작동 되나요</h1>
            </div>
            <div>이 버튼을 누르면 매칭이 진행됩니다.</div>
            <button className={styles.button} onClick={() => navigate('/matching')}>
              매칭 진행 버튼
            </button>
            <div className={styles.textbox}>
              <p>
                짧고 굵게{' '}
                <button className={styles.button} onClick={() => navigate('/matching')}>
                  팅(로고)
                </button>{' '}
                하러 가기
              </p>
            </div>
          </div>
          <div>
            {/* Placeholder Image */}
            <img
              className={styles.image}
              src="https://via.placeholder.com/700x200" // Placeholder image URL
              alt="main"
            />
          </div>
        </div>
      </Slide>
    </FullPage>
  );
}

export default MainPage;
