import { createSlice } from "@reduxjs/toolkit";

export let itemReducer = createSlice({
  name : "itemReducer",
  initialState: {
    myPoint : 0,
    pointPaymentId : -1,
    myItemList : []
  },
  reducers:{
    setPoint: (state,action)=>{
      state.myPoint = action.payload;
      console.log("+++++++++++++++ Redux My Point +++++++++++++++")
      console.log(state.myPoint)
    },
    setPointPaymentId : (state,action) => {
      state.pointPaymentId = action.payload
      console.log("+++++++++++++++ Redux pointPaymentId +++++++++++++++")
      console.log(state.pointPaymentId)
    },
    setMyItemList : (state,action) => {
      state.myItemList = action.payload
      console.log("+++++++++++++++ Redux myItemList +++++++++++++++")
      console.log(state.myItemList)
    }
  },
});

export let { setPoint, setPointPaymentId, setMyItemList } = itemReducer.actions;

export default itemReducer;