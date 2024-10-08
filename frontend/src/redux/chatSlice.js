import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:'chat',
    initialState:{
        onlineUsers:null
    },
    reducers:{
        setOnlineSocket:(state,action)=>{
            state.onlineUsers = action.payload;
        }
    }
})
export const {setOnlineSocket} = chatSlice.actions
export default chatSlice.reducer;