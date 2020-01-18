import Axios from "axios"

const api = Axios.create({
    baseURL: 'https://api-devbusca.herokuapp.com',
})

export default api