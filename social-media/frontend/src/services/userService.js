import api from "../api/api";

const ENDPOINT = '/users'

const getUserById = async (id) =>{
    const response = await api.get(`${ENDPOINT}/${id}`)
    return response.data
}

const updateProfile = async (data)=>{
    const response = await api.put(`${ENDPOINT}/profile`, data)
    return response.data
}
const updateAvatar = async(formData) =>{
    const response = await api.put(`${ENDPOINT}/avatar`, formData, {
        headers:{'Content-Type':'multipart/form-data'}
    })
    return response.data
}

const followUser = async (id) => {
  const response = await api.put(`${ENDPOINT}/follow/${id}`);
  return response.data;
};
const unfollowUser = async (id) => {
  const response = await api.put(`${ENDPOINT}/unfollow/${id}`);
  return response.data;
};
const getFollowers = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}/followers`);
  return response.data;
};
const getFollowing = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}/following`);
  return response.data;
};
const userService = {
  getUserById,
  updateProfile,
  updateAvatar,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
export default userService;