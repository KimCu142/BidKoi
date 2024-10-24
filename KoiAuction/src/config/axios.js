import axios from "axios";

const baseUrl = "https://bidkois.azurewebsites.net/BidKoi";

const config = {
  baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;

//  làm 1 hành động gì đó trc khi call api
const handleBefore = (config) => {
  const token = localStorage.getItem("token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

const handleError = (error) => {
  console.log(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
