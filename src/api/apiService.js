import axios from "axios";
import { apiPath } from "./apiPath";

const apiService = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL,
    withCredentials: true, // send the httpOnly refreshToken cookie
})

apiService.interceptors.request.use(
    (config)=>{
        // autometically get token from localstorage
        const token = localStorage.getItem('token')
        if (token && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

apiService.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        const isRefreshCall = originalRequest?.url?.includes(apiPath.refreshToken);

        if (status !== 401 || !originalRequest || originalRequest._retry || isRefreshCall) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribeTokenRefresh((token) => {
                    if (!token) return reject(error);
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(apiService(originalRequest));
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BASE_URL}${apiPath.refreshToken}`,
                {},
                { withCredentials: true }
            );

            localStorage.setItem("token", data.accessToken);
            onRefreshed(data.accessToken);

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return apiService(originalRequest);
        } catch (refreshError) {
            onRefreshed(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiService
