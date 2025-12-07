import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  })

  useEffect(() => {
    if (tokens.accessToken) {
      fetchUserInfo()
    } else {
      setLoading(false)
    }
  }, [tokens.accessToken])

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/me', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      if (response.data.success) {
        setUser(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      console.log('Login response:', response.data)
      if (response.data.success) {
        const { accessToken, refreshToken, user: userInfo } = response.data.data
        console.log('User info from login:', userInfo)
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        setTokens({ accessToken, refreshToken })
        setUser(userInfo)
        console.log('User state set to:', userInfo)
        return { success: true, user: userInfo }
      }
      return { success: false, error: response.data.error }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setTokens({ accessToken: null, refreshToken: null })
    setUser(null)
  }

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh', {
        refreshToken: tokens.refreshToken,
      })
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        setTokens({ accessToken, refreshToken })
        return accessToken
      }
      throw new Error('Token refresh failed')
    } catch (error) {
      logout()
      throw error
    }
  }

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshAccessToken,
        hasRole,
        tokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

