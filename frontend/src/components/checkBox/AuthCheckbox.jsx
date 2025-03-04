import checkBoxChecked from "../../assets/icons/Group.svg";
import checkBoxUnchecked from "../../assets/icons/Checkbox.svg";
import { useState } from "react";

export const AuthCheckbox = ({ check = () => { }, cancel = () => { } }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleClick = () => {
        if (!isChecked) {
            check();
        }
        else {
            cancel();
        }
        setIsChecked(!isChecked);
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
