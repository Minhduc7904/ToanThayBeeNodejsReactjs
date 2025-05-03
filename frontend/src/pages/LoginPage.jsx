import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/input/InputForAuthPage';
import Button from '../components/button/ButtonForAuthPage';
import GoogleLoginButton from '../components/button/GoogleLoginButton';
import LoadingSpinner from '../components/loading/LoadingSpinner';
import { AuthCheckbox } from '../components/checkBox/AuthCheckbox';
import { BeeMathLogo } from '../components/logo/BeeMathLogo';

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        username: localStorage.getItem("savedUsername") || "",
        password: "",
    });

    const { user } = useSelector((state) => state.auth);
    useEffect(() => {
        if (user) {
            navigate('/overview');
        }
    }, [user, navigate]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(login(formData))

        if (login.fulfilled.match(resultAction)) {
            if (localStorage.getItem('rememberMe') === "true") {
                localStorage.setItem("savedUsername", formData.username);
            } else {
                localStorage.removeItem("savedUsername");
            }
            let redirectPath = localStorage.getItem("redirect_after_login") || "/overview";
            redirectPath = redirectPath === "/" ? "/overview" : redirectPath;
            localStorage.removeItem("redirect_after_login");

            navigate(redirectPath); // Nếu dùng React Router
        }
    };

    return (
        <AuthLayout>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full px-4 sm:px-6 py-8 max-w-sm mx-auto bg-white backdrop-blur-md shadow-xl rounded-xl"
            >
                {/* Tiêu đề */}
                <div className='flex items-center justify-start gap-2'>
                    <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent tracking-wide drop-shadow-sm uppercase font-cubano">
                        Đăng nhập
                    </div>
                    <BeeMathLogo className="w-[2rem] h-[2rem] lg:hidden block" />
                </div>



                {/* Input Username */}
                <Input
                    type="text"
                    name="username"
                    placeholder="Tên đăng nhập"
                    title="Tên đăng nhập"
                    value={formData.username}
                    onChange={handleChange}
                    className="h-10 sm:h-12 px-4 rounded-md sm:rounded-lg text-sm"
                    required
                />

                {/* Input Password */}
                <Input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    title="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-10 sm:h-12 px-4 rounded-md sm:rounded-lg text-sm"
                    required
                />

                {/* Ghi nhớ & hỗ trợ */}
                <div className="flex items-center justify-between text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <AuthCheckbox />
                        <span>Ghi nhớ tôi</span>
                    </div>
                    <span className="cursor-pointer hover:underline">Cần giúp đỡ?</span>
                </div>

                {/* Nút Đăng nhập */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-white text-base font-semibold bg-red-600 hover:bg-red-700 rounded-md shadow-md hover:shadow-lg transition"
                >

                    {loading ? <LoadingSpinner size="1.5rem" color="border-white" /> : "Đăng nhập"}
                </Button>

                {/* Liên kết */}
                {/* Liên kết */}
                <div className="text-center text-sm text-gray-600 space-y-1">
                    <p className=" font-medium">
                        Nếu bạn chưa có tài khoản hoặc quên mật khẩu, vui lòng liên hệ với giáo viên!
                    </p>
                </div>
            </form>

        </AuthLayout>

    );
}
