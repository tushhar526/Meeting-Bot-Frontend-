import { api } from "./fetch"
import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_API_URL

export const signup = async (signup_data) => {
    const response = await api.post("auth/signup", signup_data)
    return response.data
}

export const login = async (login_data) => {
    const response = await api.post("auth/login", login_data)
    return response.data
}

export const logout = async () => {
    const response = await api.post("auth/logout")
    return response.data
}

export const getUserProfile = async () => {
    try {
        const response = await api.get("auth/me")
        return response.data.user;
    }
    catch (error) {
        return null
    }
}