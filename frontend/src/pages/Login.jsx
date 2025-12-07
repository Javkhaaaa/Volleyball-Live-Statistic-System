import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import './Login.css'

const Login = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    console.log('Login useEffect - user changed:', user)
    if (user) {
      console.log('Login useEffect - User has roles:', user.roles)
      if (user.roles?.includes('ADMIN')) {
        console.log('Redirecting to /admin')
        navigate('/admin')
      } else if (user.roles?.includes('COACH')) {
        console.log('Redirecting to /coach')
        navigate('/coach')
      } else if (user.roles?.includes('STATISTICIAN')) {
        console.log('Redirecting to /statistician')
        navigate('/statistician')
      }
    }
  }, [user, navigate])

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    try {
      const result = await login(data.email, data.password)
      console.log('Login result:', result)
      if (result.success && result.user) {
        console.log('Login successful, user roles:', result.user?.roles)
        // Redirect based on role
        if (result.user.roles?.includes('ADMIN')) {
          console.log('Redirecting to /admin')
          navigate('/admin', { replace: true })
        } else if (result.user.roles?.includes('COACH')) {
          console.log('Redirecting to /coach')
          navigate('/coach', { replace: true })
        } else if (result.user.roles?.includes('STATISTICIAN')) {
          console.log('Redirecting to /statistician')
          navigate('/statistician', { replace: true })
        } else {
          console.error('No valid role found:', result.user?.roles)
          setError('Invalid user role')
          setLoading(false)
        }
      } else {
        setError(result.error || 'Login failed')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login exception:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Volleyball League System</h1>
        <h2 className="login-subtitle">Нэвтрэх</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Имэйл</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Имэйл оруулах шаардлагатай',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Хүчинтэй имэйл оруулна уу',
                },
              })}
              placeholder="admin@volleyball.league"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Нууц үг</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Нууц үг оруулах шаардлагатай',
              })}
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          {error && <div className="error-banner">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>
        <div className="login-info">
          <p>Анхны админ данс:</p>
          <p>Имэйл: admin@volleyball.league</p>
          <p>Нууц үг: Admin@123</p>
        </div>
      </div>
    </div>
  )
}

export default Login


