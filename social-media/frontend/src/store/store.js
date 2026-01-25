import { configureStore } from "@reduxjs/toolkit";

import authReducer from './slices/authSlice'
import postReducer from './slices/postSlice'
import notificationReducer from './slices/notificationSlice'
import reducer from "./slices/postSlice";

const store ={
    reducer:{
        auth: authReducer,
        posts: postReducer,
        notifications: notificationReducer
    }
}
export default store