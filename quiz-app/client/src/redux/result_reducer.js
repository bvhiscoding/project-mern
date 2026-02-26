import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  result: []
};

const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload || null;
    },
    pushResultAction: (state, action) => {
      const { trace, selectedIndex } = action.payload || {};
      if (Number.isInteger(trace) && trace >= 0) {
        state.result[trace] = selectedIndex;
      }
    },
    resetResultAction: () => initialState
  }
});

export const { setUserId, pushResultAction, resetResultAction } = resultSlice.actions;
export default resultSlice.reducer;
