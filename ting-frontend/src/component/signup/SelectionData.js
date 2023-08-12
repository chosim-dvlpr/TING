import { Outlet } from "react-router-dom"
import Mbti from "./select/Mbti"
import Height from "./select/Height"
import Drink from "./select/Drink"
import Smoke from "./select/Smoke"
import Religion from "./select/Religion"
import Job from "./select/Job"
import Hobby from "./select/Hobby"
import Personality from "./select/Personality"
import Style from "./select/Style"
import Introduce from "./select/Introduce"
import ProfileImage from "./select/profileImage"
import styles from './SignupCommon.module.css'

function SelectionData(){
  return(
    <div>
      <h3>추가 정보 입력</h3>
      {/* <Outlet></Outlet> */}
      <div className={styles.selectDataContainer}>
        <div>
          <Mbti />
          <Height />
          <Drink />
          <Smoke />
          <Religion />
          <Job />
        </div>
        <div>
          <Hobby />
          <Personality />
          <Style />
          <Introduce />
          <ProfileImage />
        </div>
      </div>
    </div>
  )
}

export default SelectionData