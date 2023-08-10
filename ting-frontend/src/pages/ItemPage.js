import React from "react"
import { Outlet } from "react-router-dom"
import styles from "./ItemPage.module.css"

import ItemSideBar from '../component/item/common/ItemSideBar.js'
import NavBar from "../component/common/NavBar"


function ItemPage(){

  return(
    <div className={styles.background}>
    <NavBar/>
    <div className={styles.ItemContainer}>
      {/* <NavBar/> */}
      <ItemSideBar/>
      <div className={styles.OutletBoard}>
        <Outlet></Outlet>
      </div>
    </div>
    </div>

  )
}

export default ItemPage