import { createSlice } from "@reduxjs/toolkit";

export let itemReducer = createSlice({
  name : "itemReducer",
  initialState: {
    myPoint : 0,
    pointPaymentId : -1
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
    }

  },
});

export let { setPoint, setPointPaymentId } = itemReducer.actions;

export default itemReducer;