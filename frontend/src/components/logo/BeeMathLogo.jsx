import Logo from '../../assets/icons/logo2.png';
import { useNavigate } from 'react-router-dom';

export const BeeMathLogo = ({ className = "" }) => {
    const navigate = useNavigate();
    const handleLogoClick = () => {
        navigate("/"); // Điều hướng về trang chủ khi nhấp vào logo
    }
    return (
        <div
            onClick={handleLogoClick}
            className={`${className} items-center cursor-pointer`}>
            <img
                src={Logo}
                alt="BeeMath Logo"
                className="object-cover rounded-full"
            />
        </div>
    )
}

