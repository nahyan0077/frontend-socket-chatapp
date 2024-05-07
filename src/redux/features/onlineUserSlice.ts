import {createSlice} from '@reduxjs/toolkit'




const onlineUsersInitialState = {
    onlineUsers: [],
};

const onlineUserSlice = createSlice({
	name: "online-users",
	initialState: onlineUsersInitialState,
	reducers: {
		setOnlineUsers: (state, action) => {
			state.onlineUsers = action.payload;
		},
	},
});



export const { setOnlineUsers } = onlineUserSlice.actions;
export default onlineUserSlice.reducer