// src/layouts/AuthLayout.jsx
import { BeeMathLogo } from '../components/logo/BeeMathLogo';
import backgroundImage from '../assets/images/anh-nen1.jpg'; // Import ảnh từ src/assets
import ParticlesBackground from '../components/ParticlesBackground';

const AuthLayout = ({ children }) => {
    return (
        <div className="relative w-screen h-screen flex items-center justify-center 
                         overflow-hidden"
            style={{
                backgroundImage: `url(${backgroundImage})`, // Sử dụng ảnh từ src/assets
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <ParticlesBackground />
            <BeeMathLogo className="absolute top-6 left-6 lg:w-[2rem] lg:h-[2rem] lg:block hidden" />

            {children}
        </div>
    );
};

export default AuthLayout;
