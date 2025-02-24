import { useState } from 'react'
import axiosClient from '../api/axiosClient'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axiosClient.post('/v1/user/login', credentials) // Gửi yêu cầu login
            navigate('/dashboard') // Chuyển hướng sau khi login thành công
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại')
        }
    }

    return (
        <div>
            <h2>Đăng nhập</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Tên đăng nhập"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    )
}

export default LoginForm
