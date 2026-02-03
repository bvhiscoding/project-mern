import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import restaurantReducer from "./slices/restaurantSlice";
import dishReducer from "./slices/dishSlice";
import cartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    dish: dishReducer,
    cart: cartReducer,
  },
});

export default store;