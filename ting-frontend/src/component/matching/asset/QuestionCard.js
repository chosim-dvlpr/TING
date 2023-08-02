import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

function QuestionCard(){
  const state = useSelector((state) => state);
  const [allQuestion, setAllQuestion] = useState([]);
  const [qNum, setQNum] = useState(0);

  useEffect(() => {
    console.log('질문 카드');
    const questionData = state.matchingReducer.questionData?.data?.data;
    if (questionData) {
      setAllQuestion([{ id: -1, questionCard: '인사', category: 'GREET' }, ...questionData]);
      setQNum(state.matchingReducer.questionNumber);
      console.log(questionData);
      console.log(qNum);
    }
  }, [state.matchingReducer.questionData, state.matchingReducer.questionNumber]);

  return (
    <div>
      { allQuestion[qNum]?.questionCard }
    </div>
  );
}

export default QuestionCard;
