import api from "./api";

const ENDPOINT = '/dashboard'

const getStats = async (params = {}) =>{
    const response = await api.get(ENDPOINT, {params})
    return response.data
}


const dashboardService ={
    getStats
}

export default dashboardService