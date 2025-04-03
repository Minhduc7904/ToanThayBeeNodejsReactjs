import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ChoiceHeader = ({ title, route }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const isActive = location.pathname === route || location.pathname.startsWith(route + "/");
    const isDisabledHome = (location.pathname.includes("/practice") || location.pathname.includes("/class")) && route === "/";
    const isChoice = isActive && !isDisabledHome;

    const handleClick = () => {
        if (user) {
            navigate(route);
        }
    };

    return (
        <div className="flex items-center justify-start">
            <div
                onClick={handleClick}
                className={`relative px-2 py-1 text-sm font-semibold font-['Be_Vietnam_Pro'] cursor-pointer
                    ${isChoice ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}
                    group transition-colors duration-200`}
            >
                {title}
                <div
                    className={`absolute left-0 bottom-0 h-[2px] bg-slate-700 rounded-full 
        origin-center transform transition-transform duration-500 ease-in-out
        ${isChoice ? 'scale-x-100 opacity-100 w-full' : 'scale-x-0 opacity-80 w-full group-hover:scale-x-100'}`}
                />
            </div>
        </div>
    );
};

export default ChoiceHeader;
