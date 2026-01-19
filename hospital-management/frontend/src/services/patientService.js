import api from './api'
const ENDPOINT = '/patient'
const getAll = async (params = {}) =>{
    const response = await api.get(ENDPOINT, {params})
    return response.data
}

const getById = async (id) =>{
    const response = await api.get(`${ENDPOINT}/${id}`)
    return response.data
}

const create = async(patientData) =>{
    const response = await api.post(ENDPOINT, patientData)
    return response.data
}

const update = async(id, patientData) =>{
    const response = await api.put(`${ENDPOINT}/${id}`, patientData)
    return response.data
}

const remove = async(id) =>{
    const response = await api.delete(`${ENDPOINT}/${id}`)
    return response.data
}
const patientService = {
  getAll,
  getById,
  create,
  update,
  delete: remove 
}
export default patientService