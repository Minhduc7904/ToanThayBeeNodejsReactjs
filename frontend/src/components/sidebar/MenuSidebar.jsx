import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MenuSidebar = ({ onClick, route, icon, text, icon2 }) => {
    const location = useLocation();
    const closeSidebar = useSelector(state => state.sidebar?.closeSidebar); // Fix lỗi undefined

    return (
        <button
            onClick={onClick}
            className={`p-3 w-full justify-center items-center rounded-lg gap-4 inline-flex transition-all duration-300
                ${location.pathname === route 
                    ? 'bg-[#253f61] text-white' 
                    : 'bg-white text-[#253f61] hover:bg-[#f0f4fa] hover:text-[#253f61]'}`}
        >
            {icon}
            {!closeSidebar && (
                <div className="flex w-full items-center justify-between flex-row">
                    <div className="text-base font-medium font-bevietnam leading-none">
                        {text}
                    </div>
                    {icon2}
                </div>
            )}
        </button>
    );
}

export default MenuSidebar;
