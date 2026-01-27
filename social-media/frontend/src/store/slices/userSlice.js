import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';
const initialState = {
  currentProfile: null,  // Profile đang xem
  followers: [],         // Danh sách followers
  following: [],         // Danh sách following
  isLoading: false,
  isError: false,
  message: '',
};
// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (id, thunkAPI) => {
    try {
      return await userService.getUserById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// Update profile (username, bio)
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data, thunkAPI) => {
    try {
      return await userService.updateProfile(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// Update avatar
export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (formData, thunkAPI) => {
    try {
      return await userService.updateAvatar(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// Follow user
export const followUser = createAsyncThunk(
  'user/follow',
  async (id, thunkAPI) => {
    try {
      await userService.followUser(id);
      return id; // Return ID để cập nhật state
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// Unfollow user
export const unfollowUser = createAsyncThunk(
  'user/unfollow',
  async (id, thunkAPI) => {
    try {
      await userService.unfollowUser(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// Fetch followers list
export const fetchFollowers = createAsyncThunk(
  'user/fetchFollowers',
  async (id, thunkAPI) => {
    try {
      return await userService.getFollowers(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// Fetch following list
export const fetchFollowing = createAsyncThunk(
  'user/fetchFollowing',
  async (id, thunkAPI) => {
    try {
      return await userService.getFollowing(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    clearProfile: (state) => {
      state.currentProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Follow - thêm currentUser vào followers của profile đang xem
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.currentProfile) {
          // Thêm vào danh sách followers
          state.currentProfile.followers.push(action.payload);
        }
      })
      // Unfollow - xóa currentUser khỏi followers
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.followers = state.currentProfile.followers.filter(
            (followerId) => {
              // followerId có thể là string hoặc object
              const id = typeof followerId === 'object' ? followerId._id : followerId;
              return id !== action.payload;
            }
          );
        }
      })
      // Fetch followers
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      // Fetch following
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.currentProfile = {
          ...state.currentProfile,
          ...action.payload,
        };
      })
      // Update avatar
      .addCase(updateAvatar.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.avatar = action.payload.avatar;
        }
      });
  },
});
export const { reset, clearProfile } = userSlice.actions;
export default userSlice.reducer;