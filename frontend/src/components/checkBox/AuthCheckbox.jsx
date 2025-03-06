import { useState, useEffect } from "react";
import checkBoxUnchecked from "../../assets/icons/Group.svg";
import checkBoxChecked from "../../assets/icons/Checkbox.svg";

export const AuthCheckbox = () => {
    // ✅ Thêm state để theo dõi trạng thái
    const [isChecked, setIsChecked] = useState(localStorage.getItem("rememberMe") === "true");

    // ✅ Cập nhật `isChecked` khi component mount
    useEffect(() => {
        setIsChecked(localStorage.getItem("rememberMe") === "true");
    }, []);

    // ✅ Khi click vào checkbox, cập nhật state & localStorage
    const handleClick = () => {
        const newChecked = !isChecked;
        setIsChecked(newChecked);
        localStorage.setItem("rememberMe", newChecked.toString());
    };

    return (
        <div
            className="w-[1.5rem] h-[1.5rem] cursor-pointer select-none flex items-center justify-center"
            onClick={handleClick}
        >
            <img
                src={isChecked ? checkBoxChecked : checkBoxUnchecked}
                alt="Checkbox"
                className="w-full h-full transition-transform duration-200 active:scale-90"
            />
        </div>
    );
};
