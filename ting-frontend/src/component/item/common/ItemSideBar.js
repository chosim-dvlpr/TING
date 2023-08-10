import { useNavigate } from 'react-router-dom';
import styles from './ItemSideBar.module.css'
import {NavLink} from 'react-router-dom';

function ItemSideBar(){
  const navigate = useNavigate()

  return(
    <div className={styles.sideBar}>
      <div className={styles.sideBarList}>
      <NavLink to="/item/shop" className={({isActive}) => {
        return isActive? styles.selected : '';
      }}>아이템 상점</NavLink>
      </div>
      <div className={styles.sideBarList}>
      <NavLink to="/item/myitem" className={({isActive}) => {
        return isActive? styles.selected : '';
      }}>보유 아이템 관리</NavLink>
      </div>
      <div className={styles.sideBarList}>
      <NavLink to="/item/mypoint" className={({isActive}) => {
        return isActive? styles.selected : '';
      }}>포인트 충전 및 관리</NavLink>
      </div>
      {/* <div className={styles.sideBarList} onClick={()=>{navigate('/item/shop')}}>아이템 상점</div>
      <div className={styles.sideBarList} onClick={()=>{navigate('/item/myitem')}}>보유 아이템 관리</div>
      <div className={styles.sideBarList} onClick={()=>{navigate('/item/mypoint')}}>포인트 충전 및 관리</div> */}
    </div>
  )
}

export default ItemSideBar;