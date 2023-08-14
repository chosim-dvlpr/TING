import { useEffect, useState } from "react"
import basicHttp from "../../api/basicHttp";
import { useDispatch } from "react-redux";
import { getFriendId } from "../../redux/friendStore";
import styles from './FriendProfile.module.css';
import { render } from 'react-dom'
import Thermometer from 'react-thermometer-component'

function FriendProfile(props){
  let dispatch = useDispatch();

  const [friendProfile, setFriendProfile] = useState([]);
  
  const [friendImg, setFriendImg] = useState("");
  const [temp, setTemp] = useState("");

  const friendProfileAxios = () => {
    basicHttp.get(`/friend/profile/${props.friendId}`).then((response) => {
      // 불러오기 성공 시 friendList에 친구목록 저장
      if (response.data.code === 200) {
        console.log('프로필 불러오기 성공');
        // console.log(response.data.data);
        setFriendProfile(response.data.data);
        // setFriendImg(response.data.data.fishSkin)
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
  console.log('friendProfile',friendProfile);
  // console.log(fishSkin)

  return (
    <div className={styles.profileContainer}>
      <div className={styles.closeButtonContainer}>
        <button className={styles.closeButton} onClick={() => closeProfileModal()}>X</button>
      </div>  
      <div className={styles.ThermoContainer}>
        <div className={styles.image}>
          <img src={`https://i9b107.p.ssafy.io:5157/user/profile/${props.friendId}`} alt="물고기 스킨" className={styles.friendImg}></img>
        </div>
        <div className={styles.temp}>
        <Thermometer
          theme="light"
          value={temp}
          max="100"
          format="°C"
          size="small"
          height="100"
        />
        </div>
      </div>
      <div className={styles.nickname}>{ friendProfile.nickname }</div>
      <div className={styles.introduce}>자기소개{ friendProfile.introduce }</div>
      <div className={styles.selfContainer}>
        <div className={styles.self}>#셀프 소개</div>
        <div className={styles.hash}>
          { <p>#{friendProfile.region}</p> }
          { <p>#{friendProfile.height}</p> }
          { friendProfile.mbtiCode && <p>#{friendProfile.mbtiCode.name}</p> }
          { friendProfile.drinkingCode && <p>#{friendProfile.drinkingCode.name}</p> }
          { friendProfile.religionCode && <p>#{friendProfile.religionCode.name}</p> }
          { friendProfile.jobCode && <p>#{friendProfile.jobCode.name}</p> }
          { friendProfile.userHobbys &&
            friendProfile.userHobbys.map((hobby, i) => (
              <p>
                #{hobby.name}
              </p>
          )) }
          { friendProfile.userStyles &&
            friendProfile.userStyles.map((style, i) => (
              <p>
                #{style.name}
              </p>
          )) }{ friendProfile.userPersonalities &&
            friendProfile.userPersonalities.map((personality, i) => (
              <p>
                #{personality.name}
              </p>
          )) }
          </div>
      </div>
    </div>
  )
}





export default FriendProfile