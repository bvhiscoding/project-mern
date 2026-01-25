import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

import postService from "../../services/postService";

const initialState = {
  posts: [],
  currentPost: null,
  currentPage: 1,
  totalPages: 1,
  totalPosts: 0,
  isLoading: false,
  isError: false,
  message: "",
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchAll",
  async (params, thunkAPI) => {
    try {
      return await postService.getPosts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId, thunkAPI) => {
    try {
      return await postService.getPostsByUser(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/create",
  async (formData, thunkAPI) => {
    try {
      return await postService.createPost(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (id, thunkAPI) => {
    try {
      await postService.deletePost(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (id, thunkAPI) => {
    try {
      return await postService.toggleLike(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, thunkAPI) => {
    try {
      return await postService.addComment(postId, text);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, thunkAPI) => {
    try {
      return await postService.deleteComment(postId, commentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalPosts = action.payload.totalPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // FETCH POSTS BY USER
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      // CREATE POST
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); // Thêm post mới vào đầu array
      })
      // DELETE POST
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      // TOGGLE LIKE - Update post trong array
      .addCase(toggleLike.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload; // Replace post
        // Cũng update currentPost nếu đang xem post này
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })
      // ADD COMMENT - Update post
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })
      // DELETE COMMENT - Update post
      .addCase(deleteComment.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      });
  },
});

export const { reset, clearCurrentPost } = postService.actions;
export default postSlice.reducer;
