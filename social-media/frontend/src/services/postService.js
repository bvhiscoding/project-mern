import api from "../api/api";

const ENDPOINT = '/posts'

const getPosts = async(params = {}) =>{
    const response = await api.get(ENDPOINT, {params})
    return response.data
}
const getPostsByUser = async (userId) =>{
    const response = await api.get(`${ENDPOINT}/user/${userId}`)
    return response.data
}
const getPostById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data; // Single post object
};

const createPost = async (formData) =>{
    const response = await api.post(ENDPOINT, formData, {
        headers:{ 'Content-Type':'multipart/form-data'}
    })
    return response.data

}

const deletePost =async (id) =>{
    const response = await api.delete(`${ENDPOINT}/${id}`)
    return response.data
}
const toggleLike = async (id) =>{
    const response = await api.put(`${ENDPOINT}/like/${id}`)
    return response.data
}
const addComment = async (postId, text) => {
  const response = await api.post(`${ENDPOINT}/comment/${postId}`, { text });
  return response.data; 
};
const deleteComment = async (postId, commentId) => {
  const response = await api.delete(`${ENDPOINT}/comment/${postId}/${commentId}`);
  return response.data;
};

const postService ={
    getPosts,
  getPostsByUser,
  getPostById,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
}
export default postService