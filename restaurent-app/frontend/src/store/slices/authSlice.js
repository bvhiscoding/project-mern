import {createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import {authService} from '../../services/authService';
import toast from 'react-hot-toast';

export const register = createAsyncThunk(
    'auth/register',
    async(userData, thunkAPI) =>{
        try {
            const response = await authService.register(userData)
            toast.success("Registration Successful")
            return response
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            toast.error(message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async(userData, thunkAPI) =>{
        try {
            const respsone = await authService.login(userData)
            toast.success("Login Successful")
            return respsone
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            toast.error(message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async(_, thunkAPI) =>{
        try {
            authService.logout()
            toast.success("Logout Successful")
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            toast.error(message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async(_, thunkAPI) =>{
        try {
            const response = await authService.getProfile()
            return response
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async(userData, thunkAPI) =>{
        try {
            const response = await authService.updateProfile(userData)
             toast.success('Cập nhật thông tin thành công!');
            return response
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            toast.error(message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const initialState = { 
    user : authService.getCurrentUser(),
    token: localStorage.getItem('token'),
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        reset: (state) =>{
            state.isLoading= false
            state.isError= false
            state.isSuccess= false
            state.message= ''
        }
    },
    extraReducers: (builder) =>{
        builder
        // Register
        .addCase(register.pending , (state) =>{
            state.isLoading = true,
            state.isError = false
        })
        .addCase(register.fulfilled, (state, action)=>{
            state.isLoading = false,
            state.isSuccess = true,
            state.user = action.payload.user,
            state.token =action.payload.token
        })
        .addCase(register.rejected,(state, action) =>{
            state.isLoading = false,
            state.isError = true,
            state.message =action.payload
        })
        // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isSuccess = false;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
    }
})
export const { reset } = authSlice.actions;
export default authSlice.reducer;