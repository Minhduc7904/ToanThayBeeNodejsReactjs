import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
    type = 'text',
    name,
    placeholder,
    value,
    onChange,
    required = false,
    className = '',
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === 'password';
    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    const shouldFloat = isFocused || (value && value.length > 0);

    return (
        <div className="relative w-full mt-4">
            <input
                id={name}
                name={name}
                type={isPasswordField && showPassword ? 'text' : type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required={required}
                autoComplete="off"
                placeholder={placeholder}
                className={`
                    w-full border rounded-md px-3 pt-5 pb-2 h-12 text-sm text-gray-900 bg-white/50
                    border-gray-300 focus:outline-none  
                    placeholder-transparent
                    transition-all duration-200
                    ${className}
                `}
            />

            <label
                htmlFor={name}
                className={`
        absolute left-3 px-1 transition-all duration-200 font-bevietnam
        ${shouldFloat
                        ? "-top-2 text-xs text-black bg-white"
                        : "top-3.5 text-sm text-gray-700"}
    `}
            >
                {placeholder}
                {required && <span className="text-red-500"> *</span>}
            </label>



            {isPasswordField && (
                <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}

        </div>
    );
};

export default Input;
