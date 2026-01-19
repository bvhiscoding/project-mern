import api from './api'
const ENDPOINT = '/doctor'
const getAll = async (params = {}) =>{
    const response = await api.get(ENDPOINT, {params})
    return response.data
}

const getById = async (id) =>{
    const response = await api.get(`${ENDPOINT}/${id}`)
    return response.data
}

const create = async(doctorData) =>{
    const response = await api.post(ENDPOINT, doctorData)
    return response.data
}

const update = async(id, doctorData) =>{
    const response = await api.put(`${ENDPOINT}/${id}`, doctorData)
    return response.data
}

const remove = async(id) =>{
    const response = await api.delete(`${ENDPOINT}/${id}`)
    return response.data
}
const doctorService = {
  getAll,
  getById,
  create,
  update,
  delete: remove 
}
export default doctorService