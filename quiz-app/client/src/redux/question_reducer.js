import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queue: [],
  answers: [],
  trace: 0
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    startExam: (state, action) => {
      state.queue = action.payload?.questions || [];
      state.answers = action.payload?.answers || [];
      state.trace = 0;
    },
    moveNext: (state) => {
      if (state.trace < state.queue.length - 1) {
        state.trace += 1;
      }
    },
    movePrev: (state) => {
      if (state.trace > 0) {
        state.trace -= 1;
      }
    },
    resetAll: () => initialState
  }
});

export const { startExam, moveNext, movePrev, resetAll } = questionSlice.actions;
export default questionSlice.reducer;
