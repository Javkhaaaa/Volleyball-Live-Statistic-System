import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, hasRole } = useAuth()

  console.log('ProtectedRoute - user:', user, 'loading:', loading, 'requiredRole:', requiredRole)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  if (requiredRole && !hasRole(requiredRole)) {
    console.log('ProtectedRoute - User does not have required role:', requiredRole, 'User roles:', user.roles)
    return <Navigate to="/login" replace />
  }

  console.log('ProtectedRoute - Access granted')
  return children
}

export default ProtectedRoute


