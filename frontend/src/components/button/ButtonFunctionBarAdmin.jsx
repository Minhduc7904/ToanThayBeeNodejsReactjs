const ButtonFunctionBarAdmin = ({ icon, text, onClick }) => {
    return (
        <button 
        onClick={onClick}
        className="flex h-full px-[1rem] py-[0.5rem] items-center justify-center gap-[0.5rem] border border-[#CDCFD0] rounded-[3rem]">
            {icon}
            <div className="text-[#202325] text-center font-medium text-[0.875rem] leading-[0.875rem] font-['Be Vietnam Pro']">
                {text}
            </div>

        </button>
    )
}

export default ButtonFunctionBarAdmin;
