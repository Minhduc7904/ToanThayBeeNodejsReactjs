import React, { useState, useRef, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DefaultAvatar from '../../assets/images/user.png';
import AvatarUploader from '../image/AvatarUploader';
import { updateAvatar, updateUser } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';


const StudentCardModal = ({ isOpen, onClose, user }) => {
    const [gender, setGender] = useState(user?.gender ? 'Nam' : 'Nữ');
    const [className, setClassName] = useState(user?.class || '');
    const [birthDate, setBirthDate] = useState(user?.birthDate || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [highSchool, setHighSchool] = useState(user?.highSchool || '');
    const dispatch = useDispatch();
    const hasInitRef = useRef(false);

    const handleAvatarChange = (id, file) => {
        dispatch(updateAvatar(file));
    };

    useEffect(() => {
        if (user && !hasInitRef.current) {
            setAvatarUrl(user.avatarUrl || '');
            hasInitRef.current = true;
        }
        if (!user) return;
        setClassName(user.class || '');
        setBirthDate(user.birthDate || '');
        setHighSchool(user.highSchool || '');
        setGender(user.gender ? 'Nam' : 'Nữ');
    }, [user]);

    // useEffect(() => {
    //     console.log('User data:', user);
    // }, [user]);

    const handleSave = () => {
        const updatedData = {
            gender: gender === 'Nam',
            class: className,
            birthDate,
            highSchool,
        };

        // loại bỏ mọi key có value null hoặc undefined
        Object.entries(updatedData).forEach(([key, value]) => {
            if (value == null || value === '' || value === undefined) {
                delete updatedData[key];
            }
        });

        dispatch(updateUser(updatedData));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start lg:items-center justify-center overflow-y-auto pt-8 pb-8 px-2 sm:px-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-2xl p-6 rounded shadow-lg"
                    >
                        <h2 className="text-xl font-bold mb-4 text-center text-sky-700">Thông tin học sinh</h2>
                        <hr className="mb-4 border-gray-300" />

                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            {/* Avatar + ID */}
                            <div className="flex-shrink-0 flex flex-col w-full sm:w-auto justify-center items-center gap-2">
                                <AvatarUploader
                                    avatarUrl={avatarUrl}
                                    inputId="avatar-upload"
                                    id="student-avatar"
                                    onImageChange={handleAvatarChange}
                                />
                                <div className="text-sm font-medium text-gray-700">
                                    ID: <span className="text-sky-600 font-semibold">{user.studentId || user.id || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Info fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                <InfoField label="Họ và tên" value={`${user?.lastName} ${user?.firstName}`} readOnly />
                                <InfoField
                                    label="Trường"
                                    value={highSchool}
                                    onChange={(e) => setHighSchool(e.target.value)} // ✅ gắn đúng
                                />
                                <EditableSelectField
                                    label="Lớp"
                                    value={className}
                                    onChange={setClassName}
                                    options={['10', '11', '12']}
                                />
                                <EditableSelectField
                                    label="Giới tính"
                                    value={gender}
                                    onChange={setGender}
                                    options={['Nam', 'Nữ']}
                                />
                                <DateField label="Ngày sinh" value={birthDate} onChange={setBirthDate} />
                                <InfoField label="Số điện thoại" value={user?.phone || ''} readOnly />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-md"
                            >
                                Lưu
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const InfoField = ({ label, value, readOnly = false, onChange = () => { } }) => (
    <div className="w-full">
        <label className="text-xs text-gray-500">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            disabled={readOnly}
            className={`w-full mt-[0.1rem] px-3 py-1.5 rounded-md border text-sm ${readOnly
                ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
        />
    </div>
);

const DateField = ({ label, value, onChange }) => {
    // Format lại để phù hợp với input[type=date]: yyyy-MM-dd
    const formatForInput = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return date.toISOString().split("T")[0]; // yyyy-MM-dd
        } catch {
            return '';
        }
    };

    return (
        <div className="w-full">
            <label className="text-xs text-gray-500">{label}</label>
            <input
                type="date"
                value={formatForInput(value)}
                onChange={(e) => onChange(e.target.value)}
                className="w-full mt-[0.1rem] px-3 py-1.5 rounded-md border text-sm bg-white border-gray-300 text-gray-900"
            />
        </div>
    );
};

// ✅ Component dropdown có thể chỉnh sửa
const EditableSelectField = ({ label, value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={ref}>
            <label className="text-xs text-gray-500">{label}</label>
            <input
                type="text"
                readOnly
                onClick={() => setOpen(!open)}
                value={value}
                className="w-full px-3 py-1.5 mt-[0.1rem] rounded-md border text-sm bg-white cursor-pointer border-gray-300"
            />
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-16 mt-[0.1rem] left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10 max-h-40 overflow-y-auto"
                    >
                        {options.map((option, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    onChange(option);
                                    setOpen(false);
                                }}
                                className="px-3 py-2 hover:bg-sky-100 cursor-pointer text-sm"
                            >
                                {option}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentCardModal;
