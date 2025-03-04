// src/components/Input.jsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


const Input = ({
    type = 'text',
    name,
    placeholder,
    title,
    value,
    onChange,
    required = false,
    className = '',
}) => {
    const formatDate = (input) => {
        let numbers = input.replace(/\D/g, "");

        if (numbers.length > 8) {
            numbers = numbers.slice(0, 8);
        }

        let formattedValue = numbers;
        if (numbers.length > 2) {
            formattedValue = numbers.slice(0, 2) + "/" + numbers.slice(2);
        }
        if (numbers.length > 4) {
            formattedValue =
                numbers.slice(0, 2) + "/" + numbers.slice(2, 4) + "/" + numbers.slice(4);
        }

        return formattedValue;
    };

    const handleChangeDate = (e) => {
        const formatted = formatDate(e.target.value);
        onChange({ target: { name, value: formatted } });
    }

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    const isPasswordField = type === 'password';
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between">
                <p className="text-[#666666] text-base font-normal font-bevietnam">{title}
                    {required && (
                        <span className="text-red-500"> *</span>
                    )}
                </p>
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={handleTogglePassword}
                        className="text-gray-500 focus:outline-none flex items-center gap-2"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        Hiện
                    </button>
                )}
            </div>

            <div className="relative w-full">
                <input
                    type={isPasswordField && showPassword ? 'text' : type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={name === "birthDate" ? handleChangeDate : onChange}
                    required={required}
                    className={`appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none rounded-xl border border-[#666666] justify-start items-center inline-flex overflow-hidden ${className}`}
                />
                {isPasswordField && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-16 h-8 bg-white pointer-events-none"></div>
                )}
            </div>
        </div>

    );
};

export default Input;
