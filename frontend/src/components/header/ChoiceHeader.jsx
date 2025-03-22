import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ChoiceHeader = ({ title, route }) => {
    const location = useLocation();
    const navigate = useNavigate();
    let isChoice = location.pathname.includes(route);
    if (location.pathname.includes("/practice") && route === "/") {
        isChoice = false;
    }

    return (
        <div
            onClick={() => navigate(route)}
            className={`text-center justify-start text-zinc-900 text-sm font-semibold font-['Be_Vietnam_Pro'] ${isChoice ? 'text-[#334155]' : 'text-slate-700 cursor-pointer'}`}>
            {title}
            {isChoice && (
                <div className="self-stretch h-0 outline outline-2 outline-offset-[-1px] outline-slate-700" />
            )}
        </div>
    );
}

export default ChoiceHeader;