import { configureStore } from '@reduxjs/toolkit';
import questionReducer from './question_reducer';
import resultReducer from './result_reducer';

export const store = configureStore({
  reducer: {
    questions: questionReducer,
    result: resultReducer
  }
});
