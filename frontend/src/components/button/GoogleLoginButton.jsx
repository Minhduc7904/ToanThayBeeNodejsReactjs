// src/components/button/GoogleLoginButton.jsx
const GoogleLoginButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center w-full py-[0.75rem] px-[1rem] border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition text-gray-700 font-medium text-[1rem]"
        >
            <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
                className="w-[1.5rem] h-[1.5rem] mr-2"
            />
            Đăng nhập bằng Google
        </button>
    );
};

export default GoogleLoginButton;
