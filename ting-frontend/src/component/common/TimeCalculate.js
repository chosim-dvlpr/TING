// 이전 채팅
export const getDateTime = (time) => {
  if(!time) return;
  const convertedTime = convertTimeFormat(time);
  if (isSameDate(convertedTime)) {
    return convertedTime.toString().substr(15, 6);
  } else return (convertedTime.getMonth()+1)+'월 '+convertedTime.getDate()+'일\n'+convertedTime.toString().substr(15, 6);
};

// 현재 채팅
export const getCurrent = (time) => {
  return time.toString().substr(16,5);
}

// 채팅 리스트용
export const getTime = (time) => {
  if(!time) return;
  const convertedTime = convertTimeFormat(time);
  if (isSameDate(convertedTime)) {
    return convertedTime.toString().substr(15, 6);
  } else return (convertedTime.getMonth()+1)+'월 '+convertedTime.getDate()+'일';
};

// 게시판용
export const getDate = (time) => {
  if(!time) return;
  const convertedTime = convertTimeFormat(time);
  if (isSameDate(convertedTime)) {
    return (convertedTime.getMonth()+1)+'월 '+convertedTime.getDate()+'일\n'+convertedTime.toString().substr(15, 6);
  } else return (convertedTime.getMonth()+1)+'월 '+convertedTime.getDate()+'일\n'+convertedTime.toString().substr(15, 6);
};

export const isSameDate = (time) => {
  // const time = new Date(boardTime);
  const currentTime = new Date();
  return (
    time.getFullYear() === currentTime.getFullYear() &&
    time.getMonth() === currentTime.getMonth() &&
    time.getDate() === currentTime.getDate()
  );
};

export const convertTimeFormat = (time) => {
  if (!time) return;
  const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
  const date = new Date(time);
  return new Date(date.getTime() + TIME_ZONE);
};

// 안쓰는 것
export const calculateTime = (time) => {
  if(!time) return;
  console.log(new Date(time));
  console.log("!!!!!", time);
  if(time.substr(0,2)=='오후') {
    console.log('오후');
    return toString(Number(time.substr(3,2))+12)+time.substr(5,3);
  }
  return time.substr(3, 5); 
}