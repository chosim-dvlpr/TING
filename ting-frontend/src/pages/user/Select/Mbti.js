function Mbti(){
  let mbtiList = ["ISTJ", "ISFJ", "INFJ", "INTJ", 
    "ISTP", "ISFP", "INFP", "INTP", 
    "ESTP", "ESFP", "ENFP", "ENTP", 
    "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
  
  return(
    <div className="Mbti">
      <h3>MBTI</h3>
        {
          mbtiList.map((mbti, i) => {
            return (
              <button>{ mbti }</button>
              )
            }
          )
        }
    </div>
  )
}

export default Mbti