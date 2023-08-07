import { useNavigate } from 'react-router-dom';
import styles from './ItemSideBar.module.css'

function ItemSideBar(){
  const navigate = useNavigate()

  return(
    <div>
      <div className={styles.SideBarList} onClick={()=>{navigate('/item/shop')}}>아이템 상점</div>
      <div className={styles.SideBarList} onClick={()=>{navigate('/item/myitem')}}>보유 아이템 관리</div>
      <div className={styles.SideBarList} onClick={()=>{navigate('/item/mypoint')}}>포인트 충전 및 관리</div>
    </div>
  )
}

export default ItemSideBar;