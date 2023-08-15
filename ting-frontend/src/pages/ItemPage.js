import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./ItemPage.module.css";

import ItemSideBar from "../component/item/common/ItemSideBar.js";
import NavBar from "../component/common/NavBar";
import FriendButton from "../component/common/FriendButton";
import { useSelector } from "react-redux";

function ItemPage() {
  const userdata = useSelector((state) => state.userdataReducer.userdata);
  const [wheelHandlerActive, setWheelHandlerActive] = useState(true);

  return (
    <div className={styles.background}>
      <NavBar />
      {userdata && (
        <FriendButton
          toggleWheelHandler={() => setWheelHandlerActive((active) => !active)}
        />
      )}
      <div className={styles.ItemContainer}>
        <ItemSideBar />
        <div className={styles.OutletBoard}>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default ItemPage;
