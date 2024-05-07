import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/userSlice'
import onlineUserReducer from '../features/onlineUserSlice'
import {thunk} from 'redux-thunk'


const store = configureStore({
    reducer : {
        user : userReducer,
        onlineUser : onlineUserReducer
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

export default store