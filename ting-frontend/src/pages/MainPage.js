import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import AOS from "aos";
import "./aos.css";

import styles from './MainPage.module.css';


//component
import CountdownTimer from "../component/main/CountdownTimer";


function MainPage() {

const navigate = useNavigate();
//  const header1 = "love";
//  const header2 = "with";
//  const header3 = "ting";
 
  useEffect(() => {
    AOS.init();
    return () => {
      AOS.refresh(); // 컴포넌트가 언마운트될 때 AOS를 해제합니다.
    };
  }, []);

  return (
    
   <div>
    {/*section1 */}
   <div className={styles.container}>
    
    <div className={styles.section1textbox}>
      <h1>스피드 소개팅 <br></br>Ting을 만나보세요</h1>
    </div>

    <div className={styles.section1imgbox}>
    <img src="/img/main.png" alt="main" className={styles.img}></img>
    
    </div>
  
    <button onClick={()=>{ navigate("/matching") }}>Ting하러가기</button>
   </div>

    {/*section2 */}
   <div data-aos="fade-down" data-aos-duration="1000" className={styles.container}>

    <img src="/img/watch.png" alt="watch" className={styles.section2imgbox} ></img>

    <div><CountdownTimer/></div>
    {/* <div className={styles.section2textbox}><h1>5분동안 할 수 있는 일<br></br>생각해보세요</h1></div> */}
  
    </div>

      {/*section3 */}
    <div data-aos="fade-down" data-aos-duration="1000" className={styles.container}>
      <img src="/img/cards_front.png" alt="cards_front" className={styles.imgbox}></img>
      <img src="/img/cards_left.png" alt="cards_left" className={styles.imgbox}></img>
      <h1>Ting에서는<br/>5분 안에<br/>상대의 취미, 취향까지 알 수 있습니다</h1>
    </div>

    <div data-aos="fade-down" data-aos-duration="1000" className={styles.container}>
    <h1>5분 후 바로 <br/>상대에게 마음을 표현해보세요</h1>
    <img src="/img/hearthand.png" alt="hearthand" className={styles.imgbox}></img>
    </div>

    <div data-aos="fade-down" data-aos-duration="1000" className={styles.container}>
    <img src="/img/click.png" alt="click" className={styles.imgbox}></img>
    <h1>지금 Ting하러가기</h1>
    
    </div>


   
</div>
   
  );
}

export default MainPage;
