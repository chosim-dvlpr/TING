import React from "react"
import { Routes, Route } from "react-router-dom"

import ItemShop from '../component/item/ItemShop.js'
import MyItem from '../component/item/MyItem.js'
import MyPoint from '../component/item/MyPoint.js'
function ItemPage(){

  return(
    <div className="itemContainer">
      <Sidebar/>
      <div className="itemContent">
        <Routes>
          {/* 아이템 상점 */}
          <Route path="/shop" element={<ItemShop/>}></Route>
          {/* 보유 아이템 관리 */}
          <Route path="/myitem" element={<MyItem/>}></Route>
          {/* 포인트 충전 및 관리 */}
          <Route path="/mypoint" element={<MyPoint/>}></Route>
        </Routes>
      </div>
    </div>

  )
}

export default ItemPage