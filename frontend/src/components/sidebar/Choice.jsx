import { Link, useLocation } from 'react-router-dom';
const Choice = ({ route, text }) => {

    const location = useLocation();

    return (
        <Link
            to={route}
            className={`w-[15rem] pl-9 rounded-lg flex-col justify-center items-start inline-flex`}
        >
            <div className="p-2 justify-center text-start gap-4 inline-flex">
                <div className={`flex justify-center text-start text-sm font-medium font-bevietnam text-[#253f61] ${location.pathname.includes(route) ? 'underline' : ''}`}>{ text }</div>
            </div>
        </Link>
    )

}


export default Choice;