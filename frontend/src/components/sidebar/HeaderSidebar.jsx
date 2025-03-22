import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BeeMathLogo } from "../logo/BeeMathLogo";
import { toggleCloseSidebar } from "../../features/sidebar/sidebarSlice";

const HeaderSidebar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const closeSidebar = useSelector(state => state.sidebar?.closeSidebar);
    const dispatch = useDispatch();

    return (
        <button
            onClick={() => {
                dispatch(toggleCloseSidebar())
                setIsHovered(false)
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex w-full flex-row gap-[0.5rem] items-center p-[0.25rem] transition-all duration-300"
        >
            {isHovered ? (
                closeSidebar ? (
                    <div className="flex items-center justify-center w-[1.75rem] h-[1.75rem] rounded-full">
                        <div data-svg-wrapper className="relative">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.293 2.29303C8.48053 2.10556 8.73484 2.00024 9 2.00024C9.26516 2.00024 9.51947 2.10556 9.707 2.29303L14.207 6.79303C14.3945 6.98056 14.4998 7.23487 14.4998 7.50003C14.4998 7.76519 14.3945 8.0195 14.207 8.20703L9.707 12.707C9.5184 12.8892 9.2658 12.99 9.0036 12.9877C8.7414 12.9854 8.49059 12.8803 8.30518 12.6948C8.11977 12.5094 8.0146 12.2586 8.01233 11.9964C8.01005 11.7342 8.11084 11.4816 8.293 11.293L11 8.50003H1.5C1.23478 8.50003 0.98043 8.39467 0.792893 8.20714C0.605357 8.0196 0.5 7.76525 0.5 7.50003C0.5 7.23481 0.605357 6.98046 0.792893 6.79292C0.98043 6.60539 1.23478 6.50003 1.5 6.50003H11L8.293 3.70703C8.10553 3.5195 8.00021 3.26519 8.00021 3.00003C8.00021 2.73487 8.10553 2.48056 8.293 2.29303Z" fill="black" />
                            </svg>
                        </div>
                    </div>

                ) : (
                    <div className="flex items-center justify-center w-[1.75rem] h-[1.75rem] rounded-full">
                        <div data-svg-wrapper className="relative">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.707 12.707C6.51947 12.8944 6.26516 12.9998 6 12.9998C5.73484 12.9998 5.48053 12.8944 5.293 12.707L0.793 8.20697C0.605529 8.01944 0.500214 7.76513 0.500214 7.49997C0.500214 7.23481 0.605529 6.9805 0.793 6.79297L5.293 2.29297C5.4816 2.11081 5.7342 2.01002 5.9964 2.0123C6.2586 2.01457 6.50941 2.11974 6.69482 2.30515C6.88023 2.49056 6.9854 2.74137 6.98767 3.00357C6.98995 3.26577 6.88916 3.51837 6.707 3.70697L4 6.49997H13.5C13.7652 6.49997 14.0196 6.60533 14.2071 6.79286C14.3946 6.9804 14.5 7.23475 14.5 7.49997C14.5 7.76519 14.3946 8.01954 14.2071 8.20708C14.0196 8.39461 13.7652 8.49997 13.5 8.49997H4L6.707 11.293C6.89447 11.4805 6.99979 11.7348 6.99979 12C6.99979 12.2651 6.89447 12.5194 6.707 12.707Z" fill="black" />
                            </svg>
                        </div>
                    </div>
                )
            ) : (
                <BeeMathLogo className="w-[1.75rem] h-[1.75rem]" />
            )}

            {!closeSidebar && (
                <p className="p-0 font-bevietnam text-[#090a0a] text-center text-xl font-bold transition-all duration-300 hover:text-[#f97316]">
                    Toán thầy Bee
                </p>

            )}
        </button>
    );
};

export default HeaderSidebar;
