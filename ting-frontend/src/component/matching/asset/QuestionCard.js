import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./QuestionCard.module.css";

function QuestionCard() {
  const questionData = useSelector((state) => state.matchingReducer.questionData);
  const questionNumber = useSelector((state) => state.matchingReducer.questionNumber);

  useEffect(() => {
    console.log("questionData 데이터 확인=====================")
    console.log(questionData);
    console.log(questionNumber);
  }, [questionData]);

  return (
    <div className={styles.cardOuter}>
      <span className={styles.cardContent}>{questionData[questionNumber]?.questionCard}</span>
    </div>
  );
}

export default QuestionCard;
