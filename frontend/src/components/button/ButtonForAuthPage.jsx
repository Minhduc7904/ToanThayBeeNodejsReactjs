// src/components/Button.jsx
import PropTypes from 'prop-types';

const variantClasses = {
    primary: 'bg-[#dc3545] text-white hover:bg-[#a71d2a] hover:opacity-90',
    secondary: 'bg-[#111111] text-white hover:bg-blue-600 hover:opacity-90',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-500 text-gray-700 hover:bg-gray-100',
    ghost: 'text-gray-700 hover:bg-gray-200',
};

const Button = ({
    type = 'button',
    onClick,
    children,
    variant = 'primary',
    className = '',
    disabled = false,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`h-14 pt-4 pb-[17px] opacity-25 rounded-[32px] justify-center items-center inline-flex overflow-hidden ${variantClasses[variant]
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'ghost']),
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Button;
