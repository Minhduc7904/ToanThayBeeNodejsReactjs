import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const ChoiceHeader = ({ title, route }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isActive = location.pathname === route || location.pathname.startsWith(route + "/");
    const isDisabledHome = (location.pathname.includes("/practice") || location.pathname.includes("/class")) && route === "/";
    const isChoice = isActive && !isDisabledHome;

    const handleClick = () => {
        if (user) {
            navigate(route);
        }
    };

    // 👉 Nếu là mobile, return kiểu nút bấm
    if (isMobile) {
        return (
            <div className="w-full">
                <div
                    onClick={handleClick}
                    className={`w-full text-center py-2 
                         font-semibold font-['Be_Vietnam_Pro'] cursor-pointer text-sm
                        transition-all duration-300 rounded-t-md
                        ${isChoice
                            ? 'bg-sky-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-200 active:bg-gray-300'}
                    `}
                >
                    {title}
                </div>
            </div>
        );
    }

    // 👉 Nếu không phải mobile (desktop)
    return (
        <div className="flex items-center justify-start">
            <div
                onClick={handleClick}
                className={`relative px-3 py-2 text-sm font-semibold font-['Be_Vietnam_Pro'] cursor-pointer
            ${isChoice ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}
            transition-colors duration-200`}
            >
                {title}

                {/* Nếu được chọn thì render div nằm dưới chữ */}
                {isChoice && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-[6px] bg-sky-500 rounded-t-md"></div>
                )}
            </div>
        </div>

    );
};

export default ChoiceHeader;
