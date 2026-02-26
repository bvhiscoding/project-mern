import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookService from "../../services/bookService";

const initialState = {
  books: [],
  currentBook: null,
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (params = {}, thunkAPI) => {
    try {
      return await bookService.getBooks(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (id, thunkAPI) => {
    try {
      return await bookService.getBookById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData, thunkAPI) => {
    try {
      return await bookService.createBook(bookData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, bookData }, thunkAPI) => {
    try {
      return await bookService.updateBook(id, bookData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id, thunkAPI) => {
    try {
      await bookService.deleteBook(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentBook(state) {
      state.currentBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = [...state.books, action.payload];
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.map((book) =>
          book._id === action.payload._id ? action.payload : book
        );
        state.currentBook = action.payload;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book._id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentBook } = bookSlice.actions;

export default bookSlice.reducer;
