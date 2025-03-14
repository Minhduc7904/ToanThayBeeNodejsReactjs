// src/pages/RegisterPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/input/InputForAuthPage';
import Button from '../components/button/ButtonForAuthPage';
import GoogleLoginButton from '../components/button/GoogleLoginButton';
import AuthDropMenu from '../components/dropMenu/AuthDropMenu';
import { validateRegister } from '../utils/validation';
import { processRegisterForm } from '../utils/sanitizeInput';
import { setErrors } from '../features/state/stateApiSlice';

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

        // Dùng biến mới để tránh gán lại giá trị cho const formData
        const processedData = processRegisterForm({ ...formData });

        const errors = validateRegister(processedData, password2);
        if (errors.length > 0) {
            setErrors(errors);
            return;
        }

        setErrors([]);
        const resultAction = await dispatch(register(processedData));
        if (register.fulfilled.match(resultAction)) {
            navigate('/login');
        }
    };

    // const handleGoogleLogin = () => {
    //     alert('Đang phát triển');
    // };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[2rem] w-full">
                <div className="flex flex-col justify-center items-center">
                    <div className='text-[#333333] font-medium font-bevietnam text-[2rem]'>
                        Tạo tài khoản mới
                    </div>
                    <div className="text-[#666666] font-bevietnam text-[1rem]">
                        Vui lòng điền đầy đủ các trường
                        <span className="text-red-500"> *</span> dưới đây
                    </div>
                </div>
                {!nextStep && (
                    <div className='flex flex-col gap-[1.5rem] w-[30rem]'>
                        <div className="flex flex-row gap-4 w-full">
                            <Input
                                type="text"
                                name="lastName"
                                placeholder="Nhập họ và tên đệm"
                                title="Họ và tên đệm"
                                value={formData.lastName}
                                onChange={handleChange}
                                className=" h-14 pl-6 pr-6 w-full "
                                required
                            />
                            <Input
                                type="text"
                                name="firstName"
                                placeholder="Nhập tên"
                                title="Nhập tên"
                                value={formData.firstName}
                                onChange={handleChange}
                                className=" h-14 pl-6 pr-6 w-full "
                                required
                            />
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <AuthDropMenu
                                title="Giới tính"
                                type="gender"
                                selected={formData.gender}
                                onSelect={(value) => setFormData({ ...formData, gender: value })}
                                className=" h-14 pl-6 w-full "
                                required
                            />
                            <Input
                                type="text"
                                name="birthDate"
                                placeholder="DD/MM/YYYY"
                                title="Năm sinh"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className=" h-14 pl-6 pr-6 w-full "
                                required
                            />
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <Input
                                type="text"
                                name="highSchool"
                                placeholder="Nhập trường học"
                                title="Trường học"
                                value={formData.highSchool}
                                onChange={handleChange}
                                className=" h-14 pl-6 pr-6 w-full "
                                required
                            />
                            <AuthDropMenu
                                title="Lớp"
                                type="class"
                                selected={formData.class}
                                onSelect={(value) => setFormData({ ...formData, class: value })}
                                className=" h-14 pl-6 w-full "
                                required
                            />
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <Input
                                type="text"
                                name="email"
                                placeholder="Nhập email"
                                title="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className=" h-14 pl-6 pr-6 w-full "
                            />
                            <Input
                                type="tel"
                                name="phone"
                                placeholder="Nhập số điện thoại"
                                title="Số điện thoại"
                                value={formData.phone}
                                onChange={handleChange}
                                className=" h-14 pl-6 pr-6 w-full "
                            />
                        </div>
                        <Button variant="primary" className="w-full" onClick={() => setNextStep(true)}>
                            <p className="text-center text-white text-lg font-normal font-bevietnam">
                                Tiếp theo
                            </p>
                        </Button>

                    </div>
                )}
                {nextStep && (
                    <div className='flex flex-col gap-[1.5rem] w-full'>
                        <Input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            title="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleChange}
                            className=" h-14 pl-6 pr-6 w-[30rem] "
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            title="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            className=" h-14 pl-6 pr-6 w-[30rem] "
                            required
                        />

                        <Input
                            type="password"
                            name="password2"
                            placeholder="Nhập lại mật khẩu"
                            title="Nhập lại mật khẩu"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            className=" h-14 pl-6 pr-6 w-[30rem] "
                            required
                        />

                        {password2 !== formData.password && password2.length > 2 && (
                            <p className="text-red-500 text-center text-base font-bevietnam">
                                Mật khẩu không khớp
                            </p>
                        )}


                        <Button type="submit" disabled={loading} variant="secondary" className="w-full">
                            <p className="text-center text-white text-lg font-normal font-bevietnam">
                                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                            </p>
                        </Button>
                        <Button variant="primary" className="w-full" onClick={() => setNextStep(false)}>
                            <p className="text-center text-white text-lg font-normal font-bevietnam">
                                Quay lại
                            </p>
                        </Button>

                    </div>
                )}
                {/* <GoogleLoginButton onClick={handleGoogleLogin} /> */}

            </form>
            <div className="absolute right-6 top-6 flex-col">
                <div>
                    <span className="text-[#333333] text-base font-normal font-bevietnam">
                        Đã có tài khoản? {" "}
                    </span>
                    <Link
                        to="/login"
                        className="text-[#333333] text-base font-normal font-bevietnam underline"
                    >
                        Đăng nhập
                    </Link>
                </div>
                <Link
                    to="/login"
                    className="text-[#666666] text-base font-normal font-bevietnam"
                >
                    Quên tài khoản hoặc mật khẩu
                </Link>
            </div>

        </AuthLayout>
    );
}
