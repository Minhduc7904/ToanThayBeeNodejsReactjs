import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/input/InputForAuthPage';
import Button from '../components/button/ButtonForAuthPage';
import AuthDropMenu from '../components/dropMenu/AuthDropMenu';
import { validateRegister } from '../utils/validation';
import { processRegisterForm } from '../utils/sanitizeInput';

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.auth);
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '', username: '', password: '',
        gender: -1, birthDate: '', email: '', phone: '',
        highSchool: '', class: ''
    });
    const [nextStep, setNextStep] = useState(false);
    const [password2, setPassword2] = useState('');

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const processedData = processRegisterForm({ ...formData });
        const check = validateRegister(processedData, password2, dispatch);
        if (!check) return;

        const resultAction = await dispatch(register(processedData));
        if (register.fulfilled.match(resultAction)) {
            navigate('/login');
        }
    };

    return (
        <AuthLayout>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full px-4 sm:px-6 gap-2 py-8 max-w-sm mx-auto bg-white backdrop-blur-md shadow-xl rounded-xl"
            >
                <div className="mb-2 text-center text-2xl sm:text-  font-extrabold bg-gradient-to-r from-yellow-500 via-sky-600 to-indigo-600 bg-clip-text text-transparent tracking-wide drop-shadow-sm uppercase font-cubano">
                    Đăng ký
                </div>

                {!nextStep ? (
                    <>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                name="lastName"
                                placeholder="Họ và tên đệm"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="h-10 text-sm"
                            />
                            <Input
                                type="text"
                                name="firstName"
                                placeholder="Tên"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="h-10 text-sm"
                            />
                        </div>


                        <div className="flex gap-2">


                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={(e) => {
                                    console.log("birthDate:", e.target.value);
                                    handleChange(e);
                                }}
                                required
                                className="h-10 text-sm"
                            />
                        </div>
                        <Input
                            type="text"
                            name="highSchool"
                            placeholder="Trường học"
                            value={formData.highSchool}
                            onChange={handleChange}
                            required
                            className="h-10 text-sm"
                        />
                        <div className="flex gap-2">

                            <AuthDropMenu
                                title="Lớp"
                                type="class"
                                selected={formData.class}
                                onSelect={(value) => setFormData({ ...formData, class: value })}
                                className="h-10 text-sm w-full border border-gray-300"
                                required
                            />
                            <AuthDropMenu
                                title="Giới tính"
                                type="gender"
                                selected={formData.gender}
                                onSelect={(value) => setFormData({ ...formData, gender: value })}
                                className="h-10 text-sm w-full border border-gray-300"
                                required
                            />
                        </div>

                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="h-10 text-sm"
                        />

                        <Input
                            type="tel"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                            className="h-10 text-sm"
                        />

                        <Button onClick={() => setNextStep(true)} className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-base font-semibold rounded-md">
                            Tiếp theo
                        </Button>
                    </>
                ) : (
                    <>
                        <Input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="h-10 text-sm"
                        />

                        <Input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="h-10 text-sm"
                        />

                        <Input
                            type="password"
                            name="password2"
                            placeholder="Nhập lại mật khẩu"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            className="h-10 text-sm"
                        />

                        {password2 !== formData.password && password2.length > 2 && (
                            <p className="text-red-500 text-sm text-center">
                                Mật khẩu không khớp
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold rounded-md"
                        >
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </Button>

                        <Button
                            onClick={() => setNextStep(false)}
                            className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-gray-700 text-base font-semibold rounded-md"
                        >
                            Quay lại
                        </Button>
                    </>
                )}

                <div className="text-center text-sm text-gray-600 mt-2">
                    <p>
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-blue-700 hover:underline font-medium">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}

