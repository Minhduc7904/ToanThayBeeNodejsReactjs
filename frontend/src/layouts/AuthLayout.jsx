// src/layouts/AuthLayout.jsx
import '../styles/AuthLayout.css';
import backgroundImage from '../assets/images/anh-nen1.jpg'; // Import ảnh từ src/assets
import { BeeMathLogo } from '../components/logo/BeeMathLogo';

const AuthLayout = ({ children }) => {
    return (
        <div
            className="w-screen h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="bg-white/90 flex flex-col items-center rounded-3xl p-[3rem] border border-gray-400/30 shadow-md ">
                <BeeMathLogo className="absolute top-6 left-6 w-[3.5rem] h-[3.5rem] " />

                {children} 
            </div>
        </div>
    );
};

export default AuthLayout; 