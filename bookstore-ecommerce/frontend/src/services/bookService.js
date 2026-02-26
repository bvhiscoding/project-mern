import api from "./api";

const ENDPOINT = "/api/books";

const getBooks = async (params = {}) => {
  return api.get(ENDPOINT, { params });
};

const getBookById = async (id) => {
  return api.get(`${ENDPOINT}/${id}`);
};

const createBook = async (bookData) => {
  return api.post(ENDPOINT, bookData);
};

const updateBook = async (id, bookData) => {
  return api.put(`${ENDPOINT}/${id}`, bookData);
};

const deleteBook = async (id) => {
  return api.delete(`${ENDPOINT}/${id}`);
};

export default {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
