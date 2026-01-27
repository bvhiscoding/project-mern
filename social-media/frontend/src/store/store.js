import { configureStore } from "@reduxjs/toolkit";

import authReducer from './slices/authSlice'
import postReducer from './slices/postSlice'
import notificationReducer from './slices/notificationSlice'
import userReducer from './slices/userSlice'

const store = configureStore({
    reducer:{
        auth: authReducer,
        posts: postReducer,
        notifications: notificationReducer,
        user: userReducer
    }
})

export default store