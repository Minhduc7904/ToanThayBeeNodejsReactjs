// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/input/InputForAuthPage';
import Button from '../components/button/ButtonForAuthPage';
import GoogleLoginButton from '../components/button/GoogleLoginButton';
import LoadingSpinner from '../components/loading/LoadingSpinner';
import { AuthCheckbox } from '../components/checkBox/AuthCheckbox';

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        username: localStorage.getItem("savedUsername") || "",
        password: "",
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGoogleLogin = () => {
        alert('Đang phát triển');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(login(formData));
        if (login.fulfilled.match(resultAction)) {
            if (localStorage.getItem('rememberMe') === "true") {
                localStorage.setItem("savedUsername", formData.username);
            } else {
                localStorage.removeItem("savedUsername");
            }
            navigate('/dashboard');
        }
    };

    return (
        <AuthLayout className={'gap-8'}>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 w-[30rem]"
            >
                {/* Tiêu đề */}
                <div className="w-full font-bevietnam font-medium text-[#333] text-[2rem]">
                    Đăng nhập
                </div>

                {/* Input Username */}
                <Input
                    type="text"
                    name="username"
                    placeholder="Tên đăng nhập"
                    title="Tên đăng nhập"
                    value={formData.username}
                    onChange={handleChange}
                    className="
                        h-14 pl-6 
                        w-full            /* Chiều rộng full trên màn hình nhỏ */

                    "
                    required
                />

                {/* Input Password */}
                <div className="flex flex-col gap-2">
                    <Input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        title={'Mật khẩu'}
                        value={formData.password}
                        onChange={handleChange}
                        className="
                        h-14 pl-6 
                        w-full            /* Chiều rộng full trên màn hình nhỏ */
                    "
                        required
                    />
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <AuthCheckbox />
                            <div className='text-[#333333] ext-base font-normal font-bevietnam'>
                                Ghi nhớ tôi
                            </div>
                        </div>
                        <div className='text-[#333333] ext-base font-normal font-bevietnam cursor-pointer'>
                            Cần giúp đỡ ?
                        </div>
                    </div>
                </div>
                {/* Nút Đăng nhập & liên kết */}
                <div className="flex flex-col gap-4">
                    <Button type="submit" disabled={loading} variant="secondary" className="w-full">
                        {loading ? <LoadingSpinner size="1.5rem" color="border-white" /> : "Đăng nhập"}
                    </Button>

                    <div className="flex flex-row justify-between text-center">
                        <div>
                            <span className="text-[#666666] text-base font-normal font-bevietnam">
                                Không có tài khoản? {" "}
                            </span>
                            <Link
                                to="/register"
                                className="text-black text-base font-normal font-bevietnam underline"
                            >
                                Đăng ký
                            </Link>
                        </div>
                        <Link
                            to="/login"
                            className="text-[#666666] text-base font-normal font-bevietnam"
                        >
                            Quên mật khẩu
                        </Link>
                    </div>
                </div>

                {/* Nút Google */}
                <GoogleLoginButton onClick={handleGoogleLogin} />
            </form>
            
        </AuthLayout >
    );
}
