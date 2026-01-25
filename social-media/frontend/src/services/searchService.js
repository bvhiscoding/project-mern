import api from "../api/api";

const ENDPOINT= '/search'

const searchAll = async (query) =>{
    const response = await api.get(ENDPOINT, {params: {q: query}})
    return response.data
}
const searchUsers = async (query) => {
  const response = await api.get(`${ENDPOINT}/users`, { params: { q: query } });
  return response.data;
};
const searchPosts = async (query) => {
  const response = await api.get(`${ENDPOINT}/posts`, { params: { q: query } });
  return response.data;
};
const searchService = { searchAll, searchUsers, searchPosts };
export default searchService;
