import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { BeeMathLogo } from "../logo/BeeMathLogo";
import ChoiceHeader from "./ChoiceHeader";
import InputSearch from "../input/InputSearch";
import { logout } from "../../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import JoinClassModal from "../modal/JoinClassModal";
import StudentCardModal from "../modal/StudentCardModal";

const Choice = () => {
    return (
        <>
            <ChoiceHeader title="Tổng quan" route="/overview" />
            <ChoiceHeader title="Lớp học" route="/class" />
            <ChoiceHeader title="Lý thuyết" route="/articles" />
            <ChoiceHeader title="Luyện đề" route="/practice" />
        </>
    )
}

const Header = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const toggleMenuRef = useRef();
    const [isStudentCardOpen, setIsStudentCardOpen] = useState(false);

    const handleClick = () => {
        if (!user) {
            navigate("/login");
            return
        }
        setDropdownOpen(!dropdownOpen);
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Đóng dropdown nếu click ra ngoài
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }

            // Đóng menu nếu click ra ngoài (không phải chính nút mở)
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                toggleMenuRef.current &&
                !toggleMenuRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white">
            <StudentCardModal isOpen={isStudentCardOpen} onClose={() => setIsStudentCardOpen(false)} user={user} />
            <JoinClassModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <div className="w-full lg:shadow-md lg:shadow-sky-200 overflow-hidden px-2 lg:px-[2rem] pt-[1rem] pb-[6px] mb-2 lg:mb-0">
                <div className="my-0 flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start gap-0 lg:gap-4 w-[16rem]">
                        <BeeMathLogo className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                        <div
                            onClick={() => navigate("/overview")}
                            className="text-base cursor-pointer sm:text-lg md:text-xl lg:text-2xl font-bold font-bevietnam text-zinc-900 tracking-tight">
                            <span className="text-yellow-500">Toán</span> <span className="text-sky-500">Thầy Bee</span>
                        </div>
                    </div>

                    {/* Search - chỉ hiển thị ở desktop */}
                    {/* <InputSearch placeholder="Nhập id câu hỏi" className="hidden lg:block w-[16rem] h-10" /> */}
                    <div className="hidden lg:flex flex-row items-center gap-0 lg:gap-8 pb-0 lg:pt-[1rem]">
                        <Choice />
                    </div>
                    {/* Thông báo + avatar */}
                    <div className=" flex flex-row items-center justify-end gap-0 lg:gap-4 w-[16rem]">
                        {/* Icon thông báo - desktop only */}

                        {/* Avatar + Dropdown */}
                        <div className="relative w-full" ref={dropdownRef}>
                            <div
                                onClick={handleClick}
                                className="w-full flex items-center pr-2 lg:pr-3 gap-2 lg:gap-3 bg-white rounded-full border border-gray-200 cursor-pointer hover:shadow-sm transition-all"
                            >
                                <div
                                    className={`relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex justify-center items-center`}
                                >
                                    {/* Vòng sóng */}
                                    <div className={`absolute flex items-center justify-center w-full h-full rounded-full  border-2 ${user ? 'border-yellow-400 animate-wave' : ''}`}></div>

                                    {/* Avatar */}
                                    <div className={`relative flex items-center justify-center w-full h-full rounded-full overflow-hidden p-1`}>
                                        {user?.avatarUrl ? (
                                            <div className="w-full h-full flex rounded-full overflow-hidden">
                                                <img
                                                    src={user.avatarUrl}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                        ) : (
                                            <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                                                <path
                                                    d="M20 2.5C10.335 2.5 2.5 10.335 2.5 20C2.5 29.665 10.335 37.5 20 37.5C29.665 37.5 37.5 29.665 37.5 20C37.5 10.335 29.665 2.5 20 2.5ZM20 22.5C16.6983 22.5 14.1667 19.88 14.1667 16.6667C14.1667 13.4533 16.6983 10.8333 20 10.8333C23.3017 10.8333 25.8333 13.4533 25.8333 16.6667C25.8333 19.88 23.3017 22.5 20 22.5ZM10 32.3C10.1 30.38 10.8 29.03 11.73 28.07C12.72 27.05 14 26.41 15.2 26.03C15.41 25.96 15.73 26.01 16.09 26.26C16.88 26.8 18.25 27.5 20 27.5C21.75 27.5 23.12 26.8 23.91 26.26C24.27 26.01 24.59 25.96 24.8 26.03C26 26.41 27.28 27.05 28.27 28.07C29.2 29.03 29.9 30.39 30 32.29C27.18 34.59 23.65 35.84 20 35.83C16.35 35.84 12.82 34.58 10 32.3Z"
                                                    fill="#94A3B8"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm md:text-base lg:text-sm font-semibold text-sky-700">
                                    {user ? (
                                        user?.lastName + " " + user?.firstName
                                    ) : (
                                        "Đăng nhập"
                                    )}
                                </p>
                            </div>

                            <AnimatePresence>
                                {dropdownOpen && user && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="fixed right-8 mt-2 w-60 bg-white rounded shadow-lg border border-gray-200 z-40"
                                    >
                                        <div className="flex flex-col divide-y divide-gray-100">
                                            <div
                                                onClick={() => setIsStudentCardOpen(true)}
                                                className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M7 19H5C4.73478 19 4.48043 18.8946 4.29289 18.7071C4.10536 18.5196 4 18.2652 4 18V17C4 16.2044 4.31607 15.4413 4.87868 14.8787C5.44129 14.3161 6.20435 14 7 14H8M12 8C12 8.79565 11.6839 9.55871 11.1213 10.1213C10.5587 10.6839 9.79565 11 9 11C8.20435 11 7.44129 10.6839 6.87868 10.1213C6.31607 9.55871 6 8.79565 6 8C6 7.20435 6.31607 6.44129 6.87868 5.87868C7.44129 5.31607 8.20435 5 9 5C9.79565 5 10.5587 5.31607 11.1213 5.87868C11.6839 6.44129 12 7.20435 12 8ZM19.441 9.559C19.6182 9.7361 19.7589 9.9464 19.8548 10.1779C19.9507 10.4093 20.0001 10.6574 20.0001 10.908C20.0001 11.1586 19.9507 11.4067 19.8548 11.6381C19.7589 11.8696 19.6182 12.0799 19.441 12.257L13.372 18.326L10 19L10.674 15.628L16.744 9.558C16.9211 9.3809 17.1313 9.24042 17.3627 9.14458C17.5941 9.04874 17.8421 8.9994 18.0925 8.9994C18.3429 8.9994 18.5909 9.04874 18.8223 9.14458C19.0537 9.24042 19.2639 9.3809 19.441 9.558V9.559Z" stroke="black" stroke-width="2" stroke-linecap="square" stroke-linejoin="round" />
                                                </svg>
                                                Trang cá nhân
                                            </div>
                                            <div
                                                onClick={() => setIsModalOpen(true)}
                                                className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 21" fill="currentColor">
                                                    <path d="M8 1.00268e-07C8.50458 -0.000159579 8.99057 0.190406 9.36055 0.533497C9.73053 0.876587 9.95716 1.34684 9.995 1.85L10 2V8C10.0002 8.50458 9.80959 8.99057 9.4665 9.36055C9.12341 9.73053 8.65315 9.95716 8.15 9.995L8 10H2C1.49542 10.0002 1.00943 9.80959 0.639452 9.4665C0.269471 9.12341 0.0428434 8.65315 0.00500021 8.15L1.00268e-07 8V2C-0.000159579 1.49542 0.190406 1.00943 0.533497 0.639452C0.876587 0.269471 1.34684 0.0428434 1.85 0.00500021L2 1.00268e-07H8ZM8 2H2V8H8V2ZM5.5 4C5.61703 3.99996 5.73036 4.04097 5.82026 4.11589C5.91016 4.19081 5.97094 4.29489 5.992 4.41L6 4.5V5.5C6.00004 5.61703 5.95903 5.73036 5.88411 5.82026C5.80919 5.91016 5.70511 5.97094 5.59 5.992L5.5 6H4.5C4.38297 6.00004 4.26964 5.95903 4.17974 5.88411C4.08984 5.80919 4.02906 5.70511 4.008 5.59L4 5.5V4.5C3.99996 4.38297 4.04097 4.26964 4.11589 4.17974C4.19081 4.08984 4.29489 4.02906 4.41 4.008L4.5 4H5.5ZM18 2C18 1.46957 17.7893 0.960859 17.4142 0.585786C17.0391 0.210714 16.5304 1.00268e-07 16 1.00268e-07H14C13.4696 1.00268e-07 12.9609 0.210714 12.5858 0.585786C12.2107 0.960859 12 1.46957 12 2V4C12 4.53043 12.2107 5.03914 12.5858 5.41421C12.9609 5.78929 13.4696 6 14 6H16C16.5304 6 17.0391 5.78929 17.4142 5.41421C17.7893 5.03914 18 4.53043 18 4V2ZM14 2H16V4H14V2ZM4 12C4.53043 12 5.03914 12.2107 5.41421 12.5858C5.78929 12.9609 6 13.4696 6 14V16C6 16.5304 5.78929 17.0391 5.41421 17.4142C5.03914 17.7893 4.53043 18 4 18H2C1.46957 18 0.960859 17.7893 0.585786 17.4142C0.210714 17.0391 1.00268e-07 16.5304 1.00268e-07 16V14C1.00268e-07 13.4696 0.210714 12.9609 0.585786 12.5858C0.960859 12.2107 1.46957 12 2 12H4ZM4 14H2V16H4V14ZM18 14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12H14C13.4696 12 12.9609 12.2107 12.5858 12.5858C12.2107 12.9609 12 13.4696 12 14V16C12 16.5304 12.2107 17.0391 12.5858 17.4142C12.9609 17.7893 13.4696 18 14 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V14ZM14 14H16V16H14V14ZM12 9C12 8.73478 12.1054 8.48043 12.2929 8.29289C12.4804 8.10536 12.7348 8 13 8H17C17.2652 8 17.5196 8.10536 17.7071 8.29289C17.8946 8.48043 18 8.73478 18 9C18 9.26522 17.8946 9.51957 17.7071 9.70711C17.5196 9.89464 17.2652 10 17 10H13C12.7348 10 12.4804 9.89464 12.2929 9.70711C12.1054 9.51957 12 9.26522 12 9ZM10 13C10 12.7348 9.89464 12.4804 9.70711 12.2929C9.51957 12.1054 9.26522 12 9 12C8.73478 12 8.48043 12.1054 8.29289 12.2929C8.10536 12.4804 8 12.7348 8 13V17C8 17.2652 8.10536 17.5196 8.29289 17.7071C8.48043 17.8946 8.73478 18 9 18C9.26522 18 9.51957 17.8946 9.70711 17.7071C9.89464 17.5196 10 17.2652 10 17V13Z" fill="black" />
                                                </svg>
                                                Tham gia bằng mã lớp
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    navigate("/overview")
                                                }}
                                                className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 18L7.8 19.8C7.13333 20.0833 6.5 20.0293 5.9 19.638C5.3 19.2467 5 18.6923 5 17.975V5C5 4.45 5.196 3.97933 5.588 3.588C5.98 3.19667 6.45067 3.00067 7 3H17C17.55 3 18.021 3.196 18.413 3.588C18.805 3.98 19.0007 4.45067 19 5V17.975C19 18.6917 18.7 19.246 18.1 19.638C17.5 20.03 16.8667 20.084 16.2 19.8L12 18ZM12 15.8L17 17.95V5H7V17.95L12 15.8ZM12 5H7H17H12Z" fill="black" />
                                                </svg>
                                                Quản lý học tập
                                            </div>
                                            {user?.userType !== 'HS1' && (<div
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    navigate("/admin/exam-management")
                                                }}
                                                className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 14V16C10.4087 16 8.88258 16.6321 7.75736 17.7574C6.63214 18.8826 6 20.4087 6 22H4C4 19.8783 4.84285 17.8434 6.34315 16.3431C7.84344 14.8429 9.87827 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM21 17H22V22H14V17H15V16C15 15.2044 15.3161 14.4413 15.8787 13.8787C16.4413 13.3161 17.2044 13 18 13C18.7956 13 19.5587 13.3161 20.1213 13.8787C20.6839 14.4413 21 15.2044 21 16V17ZM19 17V16C19 15.7348 18.8946 15.4804 18.7071 15.2929C18.5196 15.1054 18.2652 15 18 15C17.7348 15 17.4804 15.1054 17.2929 15.2929C17.1054 15.4804 17 15.7348 17 16V17H19Z" fill="black" />
                                                </svg>
                                                Trang admin
                                            </div>)}
                                            <div
                                                className="py-2 px-3 text-sm text-red-500 hover:bg-red-100 rounded cursor-pointer flex items-center gap-2"
                                                onClick={() => dispatch(logout())}
                                            >
                                                <svg className="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H12V5H5V19H12V21H5ZM16 17L14.625 15.55L17.175 13H9V11H17.175L14.625 8.45L16 7L21 12L16 17Z" fill="black" />
                                                </svg>
                                                Đăng xuất
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>                {/* Menu desktop */}

            </div>
            <div className="bg-white shadow-md shadow-sky-200 flex lg:hidden flex-row w-full justify-between items-center gap-0 lg:gap-8 pb-0 lg:pt-[1rem]">
                <Choice />
            </div>
        </header>

    );
};

export default Header;