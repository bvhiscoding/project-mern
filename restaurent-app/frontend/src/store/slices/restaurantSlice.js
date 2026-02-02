import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import restaurantService from '../../services/restaurantService';
import toast from 'react-hot-toast';
// FETCH ALL RESTAURANTS + filters
export const fetchRestaurants = createAsyncThunk(
    'restaurants/fetchAll',
    async (_ , thunkAPI) =>{
        try {
            const response = await restaurantService.getAllRestaurants()
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
)
// FETCH SINGLE RESTAURANT by ID
export const fetchRestaurantById = createAsyncThunk(
    'restaurants/fetchById',
    async(id, thunkAPI) =>{
        try {
            const response = await restaurantService.getRestaurantById(id)
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)
// CREATE RESTAURANT (Admin only)

export const createRestaurant = createAsyncThunk(
    'restaurants/create',
    async(restaurantData, thunkAPI) =>{
        try {
            const response = await restaurantService.createRestaurant(restaurantData)
            toast.success('Restaurant created successfully');
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

// UPDATE RESTAURANT (Admin only)

export const updateRestaurant = createAsyncThunk(
    'restaurants/update',
    async({id, restaurantData}, thunkAPI)=>{
        try {
            const response = await restaurantService.updateRestaurant(id, restaurantData)
            toast.success('Restaurant updated successfully');
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message)
            return thunkAPI.rejectWithValue(message);
        }
    }
)

// DELETE RESTAURANT (Admin only)
export const deleteRestaurant = createAsyncThunk(
    'restaurants/delete',
    async(id, thunkAPI) =>{
        try {
            await restaurantService.deleteRestaurant(id)
            toast.success('Restaurant deleted successfully');
            return id
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

// INITIAL STATE

const initialState ={
    restaurants: [],
    selectedRestaurant: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
}

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        reset: (state) =>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        clearSelectedRestaurant: (state) =>{
            state.selectedRestaurant = null;
        }
    },
    extraReducers: (builder) =>{
        builder
        // ============ FETCH ALL RESTAURANTS ============
        .addCase(fetchRestaurants.pending , (state) =>{
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(fetchRestaurants.fulfilled , (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.restaurants = action.payload;
        })
        .addCase(fetchRestaurants.rejected , (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload; 
            state.restaurants = [];
        })
        // ============ FETCH RESTAURANT BY ID ============
        .addCase(fetchRestaurantById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedRestaurant = action.payload;
      })
      
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // ============ CREATE RESTAURANT ============
      
      .addCase(createRestaurant.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.restaurants.push(action.payload);
      })
      
      .addCase(createRestaurant.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // ============ UPDATE RESTAURANT ============
      
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const index = state.restaurants.findIndex(
          r => r._id === action.payload._id
        );
        if (index !== -1) {
          state.restaurants[index] = action.payload;
        }
        
        if (state.selectedRestaurant?._id === action.payload._id) {
          state.selectedRestaurant = action.payload;
        }
      })
      
      // ============ DELETE RESTAURANT ============
      
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.restaurants = state.restaurants.filter(
          r => r._id !== action.payload
        );
      });
    }
});

export const { reset, clearSelectedRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;