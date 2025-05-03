import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/auth/authSlice';
import { setIsAddView } from '../../features/filter/filterSlice';
import { fetchUsers } from '../../features/user/userSlice';
import Input from '../input/InputForAuthPage';
import Button from '../button/ButtonForAuthPage';
import AuthDropMenu from '../dropMenu/AuthDropMenu';
import { validateRegister } from '../../utils/validation';
import { processRegisterForm } from '../../utils/sanitizeInput';
import { X } from 'lucide-react';

const AddStudentModal = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.auth);
    const { search, currentPage, limit, sortOrder } = useSelector(state => state.filter);
    
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '', 
        username: '', 
        password: '',
        gender: -1, 
        birthDate: '', 
        email: '', 
        phone: '',
        highSchool: '', 
        class: '',
        userType: 'HS1'
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
            // Refresh user list after adding a new student
            dispatch(fetchUsers({ search, currentPage, limit, sortOrder }));
            // Close the modal
            dispatch(setIsAddView(false));
        }
    };

    const handleClose = () => {
        dispatch(setIsAddView(false));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Thêm học sinh mới</h2>
                    <button 
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
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
                                    onChange={handleChange}
                                    required
                                    className="w-full h-10 text-sm border border-gray-300 rounded-md px-3"
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

                            <div className="flex justify-end gap-2">
                                <Button 
                                    onClick={handleClose} 
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-md"
                                >
                                    Hủy
                                </Button>
                                <Button 
                                    onClick={() => setNextStep(true)} 
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                                >
                                    Tiếp theo
                                </Button>
                            </div>
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

                            <div className="flex justify-end gap-2">
                                <Button
                                    onClick={() => setNextStep(false)}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-md"
                                >
                                    Quay lại
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                                >
                                    {loading ? 'Đang thêm...' : 'Thêm học sinh'}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
