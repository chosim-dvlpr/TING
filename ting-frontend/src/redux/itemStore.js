import { createSlice } from "@reduxjs/toolkit";

export let itemReducer = createSlice({
  name : "itemReducer",
  initialState: {
    myPoint : 0
  },
  reducers:{
    setPoint: (state,action)=>{
      state.myPoint = action.payload;
      console.log("+++++++++++++++ Redux My Point +++++++++++++++")
      console.log(state.myPoint)
    }
  },
});

export let { setPoint } = itemReducer.actions;

export default itemReducer;