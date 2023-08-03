import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import styles from './QuestionCard.module.css'

function QuestionCard(){
  const questionData = useSelector((state) => state.matchingReducer.questionData);
  const questionNumber = useSelector((state)=> state.matchingReducer.questionNumber)

  return (
    <div className={styles.cardOuter}>
      <span className={styles.cardContent}>
        { questionData[questionNumber]?.questionCard }
      </span>
    </div>
  );
}

export default QuestionCard;
