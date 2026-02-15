import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],        // store chat list
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats(state, action) {
      // replace entire chats array
      state.chats = action.payload; 
    },
    addChat(state, action) {
      // single new chat
      state.chats.push(action.payload);
    },
    clearChats(state) {
      state.chats = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const { setChats, addChat, clearChats } = chatSlice.actions;
export default chatSlice.reducer;
