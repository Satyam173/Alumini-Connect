import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const socketSlice = createSlice({
    name:'socketio',
    initialState:{
        socket:null
    },
    reducers:{
        setSocket:(state,action)=>{
            state.socket = action.payloadl
        }
    }
})
export const setSocket = socketSlice.actions
export default socketSlice.reducer