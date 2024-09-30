import axios from "axios";



const baseUrl = "http://localhost:8080/BidKoi/";
const config = {
    baseURL: baseUrl,
};

const api =axios.create(config);
api.defaults.baseURL=baseUrl;
const handleBefore= (config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers["Authorization"]=`Bearer ${token}`;
    }
    return config;
};

api.interceptors.request.use(handleBefore,null);
export default api;