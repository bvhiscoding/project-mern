import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import dishService from '../../services/dishService';

const initialState ={
    dishes: [],
    selectedDish: null,
    isLoading: false,
    isError: false,
    message: ''
}
export const fetchAllDishes = createAsyncThunk(
    'dishes/fetchAll',
    async(_, thunkAPI) => {
        try {
            const response = await dishService.getAllDishes();
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message)
        }
    }
)


export const fetchDishesByRestaurant = createAsyncThunk(
    'dishes/fetchByRestaurant',
    async(restaurantId, thunkAPI) => {
        try {
            const response = await dishService.getDishesByRestaurant(restaurantId);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const fetchDishById = createAsyncThunk(
    'dishes/fetchById',
    async(id, thunkAPI) => {
        try {
            const response = await dishService.getDishById(id);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const createDish = createAsyncThunk(
    'dishes/create',
    async (dishData , thunkAPI) => {
        try {
            const response = await dishService.createDish(dishData);
            toast.success('Dish created successfully');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const updateDish = createAsyncThunk(
    'dishes/update',
    async ({id, dishData} , thunkAPI) => {
        try {
            const response = await dishService.updateDish(id, dishData);
            toast.success('Dish updated successfully');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteDish = createAsyncThunk(
    'dishes/delete',
    async(id, thunkAPI) => {
        try {
            await dishService.deleteDish(id);
            toast.success('Dish deleted successfully');
            return id
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

const dishSlice= createSlice({
    name: 'dishes',
    initialState,
    reducers:{
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        clearDishes: (state) => {
            state.dishes = [];
        },
        clearSelectedDish: (state) => {
            state.selectedDish = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllDishes.pending, (state) =>{
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(fetchAllDishes.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.dishes = action.payload;
        })
        .addCase(fetchAllDishes.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(fetchDishesByRestaurant.pending, (state) =>{
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(fetchDishesByRestaurant.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.dishes = action.payload;
        })
        .addCase(fetchDishesByRestaurant.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(fetchDishById.pending, (state) =>{
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(fetchDishById.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.selectedDish = action.payload;
        })
        .addCase(fetchDishById.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(createDish.pending, (state) =>{
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(createDish.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.dishes.push(action.payload);
        })
        .addCase(createDish.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(updateDish.pending, (state) =>{
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(updateDish.fulfilled, (state, action) =>{
            state.isLoading = false;    
            const index = state.dishes.findIndex(dish => dish._id === action.payload._id);
            if(index !== -1){
                state.dishes[index] = action.payload;
            }
        })
        .addCase(updateDish.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(deleteDish.pending, (state) =>{
            state.isLoading = true;
            state.isError = false;
        })  
        .addCase(deleteDish.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.dishes = state.dishes.filter(dish => dish._id !== action.payload);
        })
        .addCase(deleteDish.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const {reset, clearDishes, clearSelectedDish} = dishSlice.actions;
export default dishSlice.reducer;