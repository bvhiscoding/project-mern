import api from "./api";

const ENDPOINT = "/api/users";

const getUsers = async () => {
  return api.get(ENDPOINT);
};

const deleteUser = async (id) => {
  return api.delete(`${ENDPOINT}/${id}`);
};

const updateUserAdmin = async (id, isAdmin) => {
  return api.put(`${ENDPOINT}/${id}/admin`, { isAdmin });
};

export default { getUsers, deleteUser, updateUserAdmin };
