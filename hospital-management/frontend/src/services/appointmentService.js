import api from './api'
const ENDPOINT = '/appointment'
const getAll = async (params = {}) =>{
    const response = await api.get(ENDPOINT, {params})
    return response.data
}

const getById = async (id) =>{
    const response = await api.get(`${ENDPOINT}/${id}`)
    return response.data
}

const create = async(appointmentData) =>{
    const response = await api.post(ENDPOINT, appointmentData)
    return response.data
}

const update = async(id, appointmentData) =>{
    const response = await api.put(`${ENDPOINT}/${id}`, appointmentData)
    return response.data
}
const updateStatus =async(id, status) =>{
    const response = await api.patch(`${ENDPOINT}/${id}/status`,{status})
    return response.data
}
const remove = async(id) =>{
    const response = await api.delete(`${ENDPOINT}/${id}`)
    return response.data
}
const appointmentService = {
  getAll,
  getById,
  create,
  update,
  updateStatus,
  delete: remove 
}
export default appointmentService