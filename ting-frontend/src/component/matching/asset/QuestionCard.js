import { useSelector } from "react-redux"

function QuestionCard(){
  let state = useSelector((state)=>state)
  let questionData = state.matchingReducer.questionData.data.data 
  console.log(questionData)
  return (
    <h1>
      매칭카드
    </h1>
  )
}

export default QuestionCard