import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import searchService from "../../services/searchService";

const initialState = {
  users: [],
  posts: [],
  isLoading: false,
  isError: false,
  message: "",
};

export const searchAll = createAsyncThunk(
  "search/searchAll",
  async (query, thunkAPI) => {
    try {
      return await searchService.searchAll(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async (query, thunkAPI) => {
    try {
      return await searchService.searchUsers(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);
export const searchPosts = createAsyncThunk(
  "search/searchPosts",
  async (query, thunkAPI) => {
    try {
      return await searchService.searchPosts(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.users = [];
      state.posts = [];
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAll.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(searchAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users?.data || [];
        state.posts = action.payload.posts?.data || [];
      })
      .addCase(searchAll.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // searchUsers
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users || [];
        state.posts = []; // Clear posts
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // searchPosts
      .addCase(searchPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts || [];
        state.users = []; // Clear users
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});
export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
