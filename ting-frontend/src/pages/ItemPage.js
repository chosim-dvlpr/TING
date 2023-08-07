import React from "react"
import { Outlet } from "react-router-dom"
import styles from "./ItemPage.module.css"

import ItemSideBar from '../component/item/common/ItemSideBar.js'


function ItemPage(){

  return(
    <div className={styles.ItemContainer}>
      <ItemSideBar/>
      <div className={styles.OutletBoard}>
        <Outlet></Outlet>
      </div>
    </div>

  )
}

export default ItemPage