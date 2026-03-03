import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { refreshAccessToken } from '../service/fetch'
import { getUserProfile, logout as apiLogout, login as apiLogin } from '../service/auth.service'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
    const [status, setStatus] = useState('checking')
    const [userState, setUserState] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const userData = await getUserProfile()

                if (userData) {
                    setUserState(userData)
                    setStatus("Authenticated")
                }
                else {
                    setStatus("UnAuthenticated")
                }
            }
            catch (error) {
                console.error("Error in User initializeAuth =  ", error)
                setStatus("UnAuthenticated")
            }
        }
        initializeAuth()
    }, [])

    const logout = useCallback(async () => {
        try {
            await apiLogout()
        }
        catch (error) {
            console.error("Error in User Logout = ", error)
        }
        finally {
            setUserState(null)
            setStatus("UnAuthenticated")
            setError(null)
        }
    }, [])

    const login = async (credentials) => {
        const result = await apiLogin(credentials);
        const userData = await getUserProfile();
        if (userData) {
            setUserState(userData);
            setStatus("Authenticated");
        }
        return result;
    };

    const refreshToken = useCallback(async () => {
        try {
            const success = refreshAccessToken()
            return !!success
        }
        catch (error) { }
        finally { }
    }, [logout])

    const value = {
        status,
        userState,
        error,
        getUserProfile,
        login,
        logout,
        refreshToken,
        setUser: setUserState,
        setStatus,
        clearError: () => setError(null)
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used with in AuthProvider")
    return context
}