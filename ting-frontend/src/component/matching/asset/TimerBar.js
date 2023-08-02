import { useEffect, useState } from "react";

function TimerBar(){
  let [count, setCount] = useState(30);
  
  useEffect(()=>{{

    const id = setInterval(()=>{
      setCount((count) => count-1);
    }, 1000);

    if (count === 0){
      clearInterval(id);
    }
    return () => clearInterval(id);
  }},[count])
  
  return <h3>{ count }</h3>;
}

export default TimerBar