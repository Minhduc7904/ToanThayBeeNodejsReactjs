import { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axiosClient.get('/v1/user/profile') // API kiểm tra user đăng nhập
                setUser(data.user)
            } catch {
                navigate('/login') // Nếu chưa đăng nhập thì chuyển về login
            }
        }
        fetchUser()
    }, [navigate])

    const handleLogout = async () => {
        await axiosClient.post('/v1/user/logout') // Gọi API logout
        navigate('/login')
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
                <>
                    <p>Xin chào, {user.username}!</p>
                    <button onClick={handleLogout}>Đăng xuất</button>
                </>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    )
}

export default Dashboard
