import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoadingPage } from '../../pages/LoadingPage/LoadingPage'

export function ProtectedRoute() {
    const { status, error } = useAuth()

    if (status === 'checking') {
        return <LoadingPage />
    }

    if (status === 'UnAuthenticated') {
        return <Navigate to="/login" replace />
    }

    if (status === 'error') {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}