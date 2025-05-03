import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { BeeMathLogo } from "../logo/BeeMathLogo";
import InputSearch from "../input/InputSearch";
import { logout } from "../../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import JoinClassModal from "../modal/JoinClassModal";
import StudentCardModal from "../modal/StudentCardModal";

const ChoiceHeader = ({ title, sectionId, isChoice, onClick }) => {
    return (
        <div className="flex items-center justify-start">
            <div
                onClick={() => onClick(sectionId)}
                className={`relative px-2 py-1 text-sm font-semibold font-['Be_Vietnam_Pro'] cursor-pointer
                    ${isChoice ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}
                    group transition-colors duration-200`}
            >
                {title}
                <div
                    className={`absolute left-0 bottom-0 h-[2px] bg-slate-700 rounded-full
                        origin-center transform transition-transform duration-500 ease-in-out
                        ${isChoice ? 'scale-x-100 opacity-100 w-full' : 'scale-x-0 opacity-80 w-full group-hover:scale-x-100'}`}
                />
            </div>
        </div>
    );
};

const Choice = () => {
    const [selectedChoice, setSelectedChoice] = useState("home");

    // Function to determine which section is currently in view
    const updateActiveSection = () => {
        const sections = [
            "home", "features", "achievements", "moments", "schedule", "articles", "exams"
        ];

        // Get the current scroll position
        const scrollPosition = window.scrollY + 100; // Adding offset to improve detection

        // Find the section that is currently in view
        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    setSelectedChoice(sectionId);
                    break;
                }
            }
        }
    };

    // Add scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', updateActiveSection);

        // Initial check
        updateActiveSection();

        return () => {
            window.removeEventListener('scroll', updateActiveSection);
        };
    }, []);

    const handleChoiceClick = (sectionId) => {
        setSelectedChoice(sectionId);
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
            // Add a small offset (20px) to ensure the section is clearly visible below the header
            const offsetPosition = elementPosition - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <>
            <ChoiceHeader title="Trang chủ" sectionId="home" isChoice={selectedChoice === "home"} onClick={handleChoiceClick} />
            <ChoiceHeader title="Tính năng" sectionId="features" isChoice={selectedChoice === "features"} onClick={handleChoiceClick} />
            <ChoiceHeader title="Thành tích" sectionId="achievements" isChoice={selectedChoice === "achievements"} onClick={handleChoiceClick} />
            <ChoiceHeader title="Khoảnh khắc" sectionId="moments" isChoice={selectedChoice === "moments"} onClick={handleChoiceClick} />
            <ChoiceHeader title="Lịch học" sectionId="schedule" isChoice={selectedChoice === "schedule"} onClick={handleChoiceClick} />
            <ChoiceHeader title="Bài viết" sectionId="articles" isChoice={selectedChoice === "articles"} onClick={handleChoiceClick} />
            <ChoiceHeader title="Đề thi" sectionId="exams" isChoice={selectedChoice === "exams"} onClick={handleChoiceClick} />
        </>
    );
};

const HeaderHome = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
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
            <div className="w-full bg-white shadow-md shadow-sky-200 overflow-hidden px-[2rem] py-[1rem]">
                <div className="my-0 flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start gap-0 lg:gap-4 w-[16rem]">
                        <BeeMathLogo className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                        <div
                            onClick={() => {
                                if (location.pathname === "/") {
                                    // If already on home page, scroll to top
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    });
                                } else {
                                    navigate("/");
                                }
                            }}
                            className="text-base cursor-pointer sm:text-lg md:text-xl lg:text-2xl font-bold font-bevietnam text-zinc-900 tracking-tight">
                            <span className="text-yellow-500">Toán</span> <span className="text-sky-500">Thầy Bee</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-row items-center gap-0 lg:gap-8 pb-0">
                        <Choice />
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            onClick={() => navigate("/login")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-2 py-1 text-sm bg-gradient-to-r from-teal-400 to-sky-400 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 hidden md:flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            Vào học ngay
                        </motion.button>

                        <button
                            ref={toggleMenuRef}
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-sky-600 focus:outline-none lg:hidden"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>


                {/* Menu mobile */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            ref={menuRef}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden fixed top-0 left-0 w-4/5 max-w-[200px] h-full bg-white shadow-xl z-50 p-6"
                        >
                            <div className="flex justify-end mb-4">
                                <button onClick={() => setMenuOpen(false)} className="text-xl text-gray-600 font-bold">×</button>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Choice />

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate("/login");
                                        }}
                                        className="w-full py-3 bg-gradient-to-r from-teal-400 to-sky-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                            <polyline points="10 17 15 12 10 7" />
                                            <line x1="15" y1="12" x2="3" y2="12" />
                                        </svg>
                                        Vào học ngay
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>

    );
};

export default HeaderHome;