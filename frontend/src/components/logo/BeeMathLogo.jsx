import Logo from '../../assets/icons/logo 1.svg';

export const BeeMathLogo = ( {className = ""} ) => {
    return (
        <div className={`${className}`}>
            <img
                src={Logo}
                alt="BeeMath Logo"
                className="object-cover rounded-full"
            />
        </div>
    )
}

