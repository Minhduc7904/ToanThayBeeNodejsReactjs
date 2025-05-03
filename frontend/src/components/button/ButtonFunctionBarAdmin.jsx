const ButtonFunctionBarAdmin = ({ icon, text, onClick }) => {
    return (
        <button 
        onClick={onClick}
        className="flex px-[0.75rem] py-[0.5rem] items-center justify-center gap-[0.5rem] border border-[#CDCFD0] rounded-[2rem]">
            {icon}
            <div className="text-[#202325] text-sm text-center font-medium leading-[0.875rem] font-bevietnam">
                {text}
            </div>

        </button>
    )
}

export default ButtonFunctionBarAdmin;
