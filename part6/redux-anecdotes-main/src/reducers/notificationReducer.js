import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotif(state, action) {
        return action.payload;
    },
    clearNotification(state, action) {
        return "";
    }
  },
});

export const { setNotif, clearNotification } = notificationSlice.actions;

export const setNotification = (message, time) => {
    return async (dispatch) => {
        dispatch(setNotif(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, time * 1000)
    }
}


export default notificationSlice.reducer;