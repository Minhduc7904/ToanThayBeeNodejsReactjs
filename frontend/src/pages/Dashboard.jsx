// src/pages/Dashboard.jsx
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    return (
        <div>
            <h2>Dashboard</h2>
            {user ? (
                <>
                    <p>Chào mừng, {user.name}!</p>
                    <button onClick={handleLogout}>Đăng xuất</button>
                </>
            ) : (
                <p>Vui lòng đăng nhập.</p>
            )}
        </div>
    );
}
