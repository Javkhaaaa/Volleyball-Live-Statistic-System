import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/axiosConfig'
import { useForm } from 'react-hook-form'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/users')
      if (response.data.success) {
        setUsers(response.data.data)
      }
    } catch (err) {
      setError('Хэрэглэгчдийн мэдээлэл авахад алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  const onCreateUser = async (data) => {
    try {
      setError('')
      const response = await api.post('/admin/create-user', data)
      if (response.data.success) {
        setShowCreateForm(false)
        reset()
        fetchUsers()
        alert('Хэрэглэгч амжилттай бүртгэгдлээ')
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Хэрэглэгч бүртгэхэд алдаа гарлаа'
      )
    }
  }

  const onDeleteUser = async (userId) => {
    if (!window.confirm('Энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?')) {
      return
    }

    try {
      const response = await api.delete(`/admin/users/${userId}`)
      if (response.data.success) {
        fetchUsers()
        alert('Хэрэглэгч амжилттай устгагдлаа')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Хэрэглэгч устгахад алдаа гарлаа')
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Админ Хяналтын Самбар</h1>
          <p>
            Сайн байна уу, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <button onClick={logout} className="logout-button">
          Гарах
        </button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-actions">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-button"
          >
            {showCreateForm ? 'Хаах' : '+ Шинэ хэрэглэгч бүртгэх'}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {showCreateForm && (
          <div className="create-user-form">
            <h2>Шинэ хэрэглэгч бүртгэх</h2>
            <form onSubmit={handleSubmit(onCreateUser)}>
              <div className="form-row">
                <div className="form-group">
                  <label>Имэйл *</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Имэйл оруулах шаардлагатай',
                    })}
                  />
                  {errors.email && (
                    <span className="error">{errors.email.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Нууц үг *</label>
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Нууц үг оруулах шаардлагатай',
                      minLength: {
                        value: 8,
                        message: 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой',
                      },
                    })}
                  />
                  {errors.password && (
                    <span className="error">{errors.password.message}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Нэр *</label>
                  <input
                    type="text"
                    {...register('firstName', {
                      required: 'Нэр оруулах шаардлагатай',
                    })}
                  />
                  {errors.firstName && (
                    <span className="error">{errors.firstName.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Овог *</label>
                  <input
                    type="text"
                    {...register('lastName', {
                      required: 'Овог оруулах шаардлагатай',
                    })}
                  />
                  {errors.lastName && (
                    <span className="error">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Утас</label>
                  <input type="text" {...register('phone')} />
                </div>

                <div className="form-group">
                  <label>Эрх *</label>
                  <select
                    {...register('role', {
                      required: 'Эрх сонгох шаардлагатай',
                    })}
                  >
                    <option value="">Сонгох...</option>
                    <option value="COACH">Дасгалжуулагч</option>
                    <option value="STATISTICIAN">Статистикч</option>
                  </select>
                  {errors.role && (
                    <span className="error">{errors.role.message}</span>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-button">
                Бүртгэх
              </button>
            </form>
          </div>
        )}

        <div className="users-table-container">
          <h2>Бүртгэлтэй хэрэглэгчид</h2>
          {loading ? (
            <div>Уншиж байна...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имэйл</th>
                  <th>Нэр</th>
                  <th>Овог</th>
                  <th>Утас</th>
                  <th>Эрх</th>
                  <th>Төлөв</th>
                  <th>Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      Хэрэглэгч олдсонгүй
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.email}</td>
                      <td>{u.firstName}</td>
                      <td>{u.lastName}</td>
                      <td>{u.phone || '-'}</td>
                      <td>
                        {u.roles?.map((r) => (
                          <span key={r} className="role-badge">
                            {r}
                          </span>
                        ))}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            u.isActive ? 'active' : 'inactive'
                          }`}
                        >
                          {u.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => onDeleteUser(u.id)}
                          className="delete-button"
                          disabled={u.id === user?.id}
                        >
                          Устгах
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard


