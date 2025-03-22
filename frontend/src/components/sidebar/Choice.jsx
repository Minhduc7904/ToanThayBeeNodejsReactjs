import { Link, useLocation } from 'react-router-dom';
const Choice = ({ route, text }) => {

    const location = useLocation();

    return (
        <Link
            to={route}
            className={`w-[15rem] h-11 pl-9 rounded-lg flex-col justify-center items-center gap-[7px] inline-flex`}
        >
            <div className="self-stretch p-3 justify-center items-center gap-4 inline-flex">
                <div className={`grow shrink basis-0 text-sm font-medium font-bevietnam leading-none text-[#253f61] ${location.pathname.includes(route) ? 'underline' : ''}`}>{ text }</div>
            </div>
        </Link>
    )

}


export default Choice;