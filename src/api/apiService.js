import axios from "axios";

const apiService = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL
})

apiService.interceptors.request.use(
    (config)=>{
        // autometically get token from localstorage
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        } 
        return config
    },
    (error)=>Promise.reject(error)
)

export default apiService