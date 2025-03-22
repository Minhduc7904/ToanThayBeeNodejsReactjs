import Logo from '../../assets/icons/logo2.png';

export const BeeMathLogo = ( {className = ""} ) => {
    return (
        <div className={`${className} items-center`}>
            <img
                src={Logo}
                alt="BeeMath Logo"
                className="object-cover rounded-full"
            />
        </div>
    )
}

