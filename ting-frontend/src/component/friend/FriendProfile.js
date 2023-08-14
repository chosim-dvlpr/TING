import { useEffect, useState } from "react"
import basicHttp from "../../api/basicHttp";
import { useDispatch } from "react-redux";
import { getFriendId } from "../../redux/friendStore";
import styles from './FriendProfile.module.css';

function FriendProfile(props){
  let dispatch = useDispatch();

  const [friendProfile, setFriendProfile] = useState([]);
  
  const [friendImg, setFriendImg] = useState("");
  const [temp, setTemp] = useState("");

  const friendProfileAxios = () => {
    basicHttp.get(`/friend/profile/${props.userId}`).then((response) => {
      // 불러오기 성공 시 friendList에 친구목록 저장
      if (response.data.code === 200) {
        console.log('프로필 불러오기 성공');
        console.log(response.data.data);
        setFriendProfile(response.data.data);
        setFriendImg(response.data.data.fishSkin)
      }
      else if (response.data.code === 400) {
        console.log('프로필 불러오기 실패');
      }
    })
    .catch(() => console.log("실패"));
    
  }

  useEffect(() => {
    friendProfileAxios();
  }, []);

  useEffect(() => {
    setTemp(props.temperature);
  }, [props.temperature])

  const closeProfileModal = () => {
    dispatch(getFriendId(null))
  };




  return (
    <div>
      <button className={styles.closeButton} onClick={() => closeProfileModal()}>X</button>
      {/* 프로필 이미지 추가 필요 */}
      <div className={styles.image}>
      <img  src={`https://i9b107.p.ssafy.io:5157/${friendImg}`} alt="물고기 스킨" className={styles.friendImg}></img>
      </div>
      <div className={styles.nickname}>{ friendProfile.nickname }</div>
      <div className={styles.temp}>{temp}℃</div>
      <div className={styles.introduce}>자기소개{ friendProfile.introduce }</div>
      <div className={styles.self}>#셀프 소개</div>
      <div className={styles.hash}>
        <div>#{ friendProfile.region }</div>
        <div>#{ friendProfile.height }</div>
        <div>#{ friendProfile.mbtiCode && friendProfile.mbtiCode.name }</div>
        <div>#{ friendProfile.drinkingCode && friendProfile.drinkingCode.name }</div>
        <div>#{ friendProfile.religionCode && friendProfile.religionCode.name }</div>
        <div>#{ friendProfile.jobCode && friendProfile.jobCode.name }</div>
        <div>#{ friendProfile.userHobbys &&
          friendProfile.userHobbys.map((hobby, i) => (
          hobby.name
        )) }</div>
        <div>#{ friendProfile.userStyles && 
          friendProfile.userStyles.map((style, i) => (
          style.name
        )) }</div>
        <div>#{ friendProfile.userPersonalities && 
          friendProfile.userPersonalities.map((personality, i) => (
          personality.name
        )) }</div>
      </div>
      {/* 온도 추가 필요 */}
      <hr/>
    </div>
  )
}





export default FriendProfile