import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_API_URL


let onAuthFailedCallback = null;

export function setAuthFailedCallback(callback) {
    onAuthFailedCallback = callback
}

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve()
    })

    failedQueue = [];
}


export async function refreshAccessToken() {
    try {
        await axios.post(`${BASE_URL}auth/refreshToken`, {}, { withCredentials: true });
        return true;
    }
    catch (error) {
        return false
    }
}


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => {
                    return api(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const success = await refreshAccessToken();
            isRefreshing = false;

            if (!success) {
                processQueue(error);
                if (onAuthFailedCallback) onAuthFailedCallback();
                return Promise.reject(error)
            }

            processQueue(null)
            return api(originalRequest);
        }

        return Promise.reject(error)
    }
);
