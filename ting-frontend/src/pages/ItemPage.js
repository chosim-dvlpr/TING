import React from "react"
import { Outlet } from "react-router-dom"
import styles from "./ItemPage.module.css"

import SideBar from '../component/item/common/ItemSideBar.js'


function ItemPage(){

  return(
    <div className="itemContainer">
      <div className={styles.SideBar}>
        <SideBar/>
      </div>
      
      <div className={styles.OutletBoard}>
        <Outlet></Outlet>
      </div>
    </div>

  )
}

export default ItemPage