import axios from "axios"
import Cookies from "js-cookie"

const api = axios.create({
    baseURL:"http://localhost:8000/api/",
    withCredentials:true,
});

//add csrf token automatically
api.interceptors.request.use((config) => {
    const csrfToken =Cookies.get("csrftoken")
    if(csrfToken){
        config.headers["X-CSRFToken"] = csrfToken
    }
    return config
})
export default api;