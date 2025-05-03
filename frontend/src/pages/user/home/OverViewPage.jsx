import UserLayout from "../../../layouts/UserLayout"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MoveRight, MoveLeft } from "lucide-react"
import { motion } from "framer-motion"
import ClassImage from "../../../components/image/ClassImage"
import { fetchClassesOverview, getUncompletedLearningItem } from "../../../features/class/classSlice"
import { fetchAttemptsByUser } from "../../../features/attempt/attemptSlice"
import { fetchSavedExam } from "../../../features/exam/examSlice"
import { fetchCodesByType } from "../../../features/code/codeSlice"
import { useNavigate } from "react-router-dom"
import Schedule from "../../../components/Schedule"
import { formatDate } from "../../../utils/formatters"
import LoadingSpinner from "../../../components/loading/LoadingSpinner"
import { setCurrentPage } from "../../../features/filter/filterSlice"
import Pagination from "../../../components/Pagination"
import NoDataFound from "../../../assets/images/error-file.png"
import ExamCard from "../../../components/card/ExamCard"
import { resetFilters } from "../../../features/filter/filterSlice";

const ButtonSidebar = ({ choice, onClick, value, text, icon, isOpen, count = null, scrollToRef }) => {
    const isActive = choice === value;

    const handleClick = () => {
        onClick?.();
        if (scrollToRef?.current) {
            const offset = 200;
            const elementTop = scrollToRef.current.getBoundingClientRect().top + window.pageYOffset;

            window.scrollTo({
                top: elementTop - offset,
                behavior: 'smooth'
            });
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`cursor-pointer self-stretch p-2 ${isActive
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'hover:bg-gray-200 text-black'
                } rounded-md inline-flex w-full justify-start items-center gap-2.5 transition`}
        >
            <div className="flex h-full justify-center items-center min-w-[24px]">
                {icon(isActive)}
            </div>
            <motion.div
                initial={false}
                animate={{
                    opacity: isOpen ? 1 : 0,
                    width: isOpen ? '100%' : 0,
                }}
                transition={{
                    duration: 0.2,
                    ease: [0.25, 0.1, 0.25, 1.0],
                }}
                className="flex flex-row w-full items-center justify-between gap-2"
            >
                <p className="text-md text-start font-medium font-bevietnam truncate w-full">{text}</p>
                {count !== null && (
                    <p className="text-end text-sm font-medium font-cubano leading-none min-w-2">{count}</p>
                )}
            </motion.div>
        </button>
    );
};


const ClassCard = ({ name, studyTime, dayOfWeek, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="flex flex-col p-3 sm:p-4 gap-2 border border-cyan-700 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex flex-row gap-4 justify-center sm:justify-start">
                <ClassImage name={name} className="h-[6rem] sm:h-[8rem] w-32 sm:w-40" />
            </div>
            <div className="self-stretch justify-start text-zinc-900 font-semibold font-bevietnam text-sm sm:text-base text-center sm:text-left truncate">
                {name}
            </div>
            <div className="self-stretch text-xs justify-center sm:justify-start flex flex-row items-center gap-2 text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 15" fill="none">
                    <path d="M6.99992 0.333374C10.6819 0.333374 13.6666 3.31804 13.6666 7.00004C13.6666 10.682 10.6819 13.6667 6.99992 13.6667C3.31792 13.6667 0.333252 10.682 0.333252 7.00004C0.333252 3.31804 3.31792 0.333374 6.99992 0.333374ZM6.99992 1.66671C5.58543 1.66671 4.22888 2.22861 3.22868 3.2288C2.22849 4.229 1.66659 5.58555 1.66659 7.00004C1.66659 8.41453 2.22849 9.77108 3.22868 10.7713C4.22888 11.7715 5.58543 12.3334 6.99992 12.3334C8.41441 12.3334 9.77096 11.7715 10.7712 10.7713C11.7713 9.77108 12.3333 8.41453 12.3333 7.00004C12.3333 5.58555 11.7713 4.229 10.7712 3.2288C9.77096 2.22861 8.41441 1.66671 6.99992 1.66671ZM6.99992 3.00004C7.16321 3.00006 7.32081 3.06001 7.44283 3.16852C7.56486 3.27702 7.64281 3.42654 7.66192 3.58871L7.66658 3.66671V6.72404L9.47125 8.52871C9.59082 8.64868 9.66023 8.80966 9.6654 8.97896C9.67057 9.14826 9.61111 9.31318 9.49909 9.44023C9.38706 9.56727 9.23088 9.64691 9.06227 9.66297C8.89365 9.67904 8.72525 9.63031 8.59125 9.52671L8.52858 9.47137L6.52859 7.47137C6.42497 7.36767 6.35843 7.23271 6.33925 7.08737L6.33325 7.00004V3.66671C6.33325 3.4899 6.40349 3.32033 6.52851 3.1953C6.65354 3.07028 6.82311 3.00004 6.99992 3.00004Z" fill="currentColor" />
                </svg>
                <p className="text-md font-normal font-bevietnam">{dayOfWeek} {studyTime}</p>
            </div>
        </div>
    )
}


const OverViewPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [choice, setChoice] = useState(0)
    const { currentPage, totalItems } = useSelector((state) => state.filter);
    const { classes, learningItems, loadingClass, loadingLearningItem } = useSelector((state) => state.classes);
    const { codes } = useSelector((state) => state.codes);
    const { attempts, loadingAttempt } = useSelector((state) => state.attempts);
    const { exams, loadingExam } = useSelector((state) => state.exams);

    const [didInit, setDidInit] = useState(false); // 👉 Thêm cờ kiểm soát mount đầu tiên

    useEffect(() => {
        if (!didInit) {
            dispatch(resetFilters());
            setDidInit(true);
        }
    }, [dispatch, didInit]);

    const [savedExamPage, setSavedExamPage] = useState(1);
    const examsPerPage = 6;

    // Filter states
    const [filters, setFilters] = useState({
        chapter: '',
        typeOfExam: '',
        class: '',
        name: ''
    });

    // Apply filters to exams
    let filteredExams = []
    if (exams?.length > 0 && exams[0]?.exam) {
        filteredExams = exams?.filter(exam => {
            // console.log(exam.exam, filters.name)

            return (
                // Filter by chapter
                (filters.chapter === '' ||
                    exam.exam?.chapter === filters.chapter) &&
                // Filter by exam type
                (filters.typeOfExam === '' ||
                    exam.exam?.typeOfExam === filters.typeOfExam) &&
                // Filter by class
                (filters.class === '' ||
                    exam.exam?.class === filters.class) &&
                // Filter by name
                (filters.name === '' ||
                    (exam.exam?.name && exam.exam?.name?.toLowerCase().includes(filters.name.toLowerCase())))
            );
        });
    }


    const paginatedExams = filteredExams?.slice(
        (savedExamPage - 1) * examsPerPage,
        savedExamPage * examsPerPage
    );

    // Get unique values for dropdowns
    const getUniqueValues = (field, codeField) => {
        if (!exams || exams.length === 0 || !exams[0]?.exam) return [];
        const values = exams
            .map(exam => exam.exam?.[field])
            .filter(value => value); // Remove null/undefined

        const valuesDescription = values.map(value => {
            const code = codes[codeField]?.find(c => c.code === value);
            return code ? code.description : value;
        });

        return [...new Set(valuesDescription)].sort();
    };

    const uniqueChapters = getUniqueValues('chapter', 'chapter');
    const uniqueExamTypes = getUniqueValues('typeOfExam', 'exam type');
    const uniqueClasses = getUniqueValues('class', 'grade');

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        const codeField = name === 'chapter' ? 'chapter' : name === 'typeOfExam' ? 'exam type' : 'grade';
        setSavedExamPage(1);

        if (name === 'name' || value == '') {
            setFilters(prev => ({
                ...prev,
                [name]: value
            }));
            return;
        }

        setFilters(prev => ({
            ...prev,
            [name]: codes[codeField]?.find(c => c.description === value)?.code
        }));

        // setFilters(prev => ({
        //     ...prev,
        //     [name]: value
        // }));
    };

    const sectionRefs = {
        class: useRef(null),
        schedule: useRef(null),
        exercise: useRef(null),
        history: useRef(null),
        exams: useRef(null),
    };

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    useEffect(() => {
        dispatch(fetchClassesOverview())
        dispatch(fetchSavedExam())
        dispatch(getUncompletedLearningItem())
        dispatch(fetchCodesByType(['duration', 'dow', 'chapter', 'exam type', 'grade']))
    }, [dispatch])

    useEffect(() => {
        if (didInit) dispatch(fetchAttemptsByUser({ currentPage }))
    }, [dispatch, currentPage, didInit])


    const iconClass = (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path d="M12 14.5C12.1978 14.5 12.3911 14.4414 12.5556 14.3315C12.72 14.2216 12.8482 14.0654 12.9239 13.8827C12.9996 13.7 13.0194 13.4989 12.9808 13.3049C12.9422 13.1109 12.847 12.9327 12.7071 12.7929C12.5673 12.653 12.3891 12.5578 12.1951 12.5192C12.0011 12.4806 11.8 12.5004 11.6173 12.5761C11.4346 12.6518 11.2784 12.78 11.1685 12.9444C11.0586 13.1089 11 13.3022 11 13.5C11 13.7652 11.1054 14.0196 11.2929 14.2071C11.4804 14.3946 11.7348 14.5 12 14.5ZM17 14.5C17.1978 14.5 17.3911 14.4414 17.5556 14.3315C17.72 14.2216 17.8482 14.0654 17.9239 13.8827C17.9996 13.7 18.0194 13.4989 17.9808 13.3049C17.9422 13.1109 17.847 12.9327 17.7071 12.7929C17.5673 12.653 17.3891 12.5578 17.1951 12.5192C17.0011 12.4806 16.8 12.5004 16.6173 12.5761C16.4346 12.6518 16.2784 12.78 16.1685 12.9444C16.0586 13.1089 16 13.3022 16 13.5C16 13.7652 16.1054 14.0196 16.2929 14.2071C16.4804 14.3946 16.7348 14.5 17 14.5ZM12 18.5C12.1978 18.5 12.3911 18.4414 12.5556 18.3315C12.72 18.2216 12.8482 18.0654 12.9239 17.8827C12.9996 17.7 13.0194 17.4989 12.9808 17.3049C12.9422 17.1109 12.847 16.9327 12.7071 16.7929C12.5673 16.653 12.3891 16.5578 12.1951 16.5192C12.0011 16.4806 11.8 16.5004 11.6173 16.5761C11.4346 16.6518 11.2784 16.78 11.1685 16.9444C11.0586 17.1089 11 17.3022 11 17.5C11 17.7652 11.1054 18.0196 11.2929 18.2071C11.4804 18.3946 11.7348 18.5 12 18.5ZM17 18.5C17.1978 18.5 17.3911 18.4414 17.5556 18.3315C17.72 18.2216 17.8482 18.0654 17.9239 17.8827C17.9996 17.7 18.0194 17.4989 17.9808 17.3049C17.9422 17.1109 17.847 16.9327 17.7071 16.7929C17.5673 16.653 17.3891 16.5578 17.1951 16.5192C17.0011 16.4806 16.8 16.5004 16.6173 16.5761C16.4346 16.6518 16.2784 16.78 16.1685 16.9444C16.0586 17.1089 16 17.3022 16 17.5C16 17.7652 16.1054 18.0196 16.2929 18.2071C16.4804 18.3946 16.7348 18.5 17 18.5ZM7 14.5C7.19778 14.5 7.39112 14.4414 7.55557 14.3315C7.72002 14.2216 7.84819 14.0654 7.92388 13.8827C7.99957 13.7 8.01937 13.4989 7.98079 13.3049C7.9422 13.1109 7.84696 12.9327 7.70711 12.7929C7.56725 12.653 7.38907 12.5578 7.19509 12.5192C7.00111 12.4806 6.80004 12.5004 6.61732 12.5761C6.43459 12.6518 6.27841 12.78 6.16853 12.9444C6.05865 13.1089 6 13.3022 6 13.5C6 13.7652 6.10536 14.0196 6.29289 14.2071C6.48043 14.3946 6.73478 14.5 7 14.5ZM19 4.5H18V3.5C18 3.23478 17.8946 2.98043 17.7071 2.79289C17.5196 2.60536 17.2652 2.5 17 2.5C16.7348 2.5 16.4804 2.60536 16.2929 2.79289C16.1054 2.98043 16 3.23478 16 3.5V4.5H8V3.5C8 3.23478 7.89464 2.98043 7.70711 2.79289C7.51957 2.60536 7.26522 2.5 7 2.5C6.73478 2.5 6.48043 2.60536 6.29289 2.79289C6.10536 2.98043 6 3.23478 6 3.5V4.5H5C4.20435 4.5 3.44129 4.81607 2.87868 5.37868C2.31607 5.94129 2 6.70435 2 7.5V19.5C2 20.2956 2.31607 21.0587 2.87868 21.6213C3.44129 22.1839 4.20435 22.5 5 22.5H19C19.7956 22.5 20.5587 22.1839 21.1213 21.6213C21.6839 21.0587 22 20.2956 22 19.5V7.5C22 6.70435 21.6839 5.94129 21.1213 5.37868C20.5587 4.81607 19.7956 4.5 19 4.5ZM20 19.5C20 19.7652 19.8946 20.0196 19.7071 20.2071C19.5196 20.3946 19.2652 20.5 19 20.5H5C4.73478 20.5 4.48043 20.3946 4.29289 20.2071C4.10536 20.0196 4 19.7652 4 19.5V10.5H20V19.5ZM20 8.5H4V7.5C4 7.23478 4.10536 6.98043 4.29289 6.79289C4.48043 6.60536 4.73478 6.5 5 6.5H19C19.2652 6.5 19.5196 6.60536 19.7071 6.79289C19.8946 6.98043 20 7.23478 20 7.5V8.5ZM7 18.5C7.19778 18.5 7.39112 18.4414 7.55557 18.3315C7.72002 18.2216 7.84819 18.0654 7.92388 17.8827C7.99957 17.7 8.01937 17.4989 7.98079 17.3049C7.9422 17.1109 7.84696 16.9327 7.70711 16.7929C7.56725 16.653 7.38907 16.5578 7.19509 16.5192C7.00111 16.4806 6.80004 16.5004 6.61732 16.5761C6.43459 16.6518 6.27841 16.78 6.16853 16.9444C6.05865 17.1089 6 17.3022 6 17.5C6 17.7652 6.10536 18.0196 6.29289 18.2071C6.48043 18.3946 6.73478 18.5 7 18.5Z"
                fill={isActive ? "white" : "black"} />
        </svg>
    )

    const iconSaveExam = (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path d="M19 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V5.5C3 4.96957 3.21071 4.46086 3.58579 4.08579C3.96086 3.71071 4.46957 3.5 5 3.5H16L21 8.5V19.5C21 20.0304 20.7893 20.5391 20.4142 20.9142C20.0391 21.2893 19.5304 21.5 19 21.5Z"
                stroke={isActive ? "white" : "black"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17 21.5V13.5H7V21.5"
                stroke={isActive ? "white" : "black"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 3.5V8.5H15"
                stroke={isActive ? "white" : "black"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )

    const iconExercise = (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="23" viewBox="0 0 18 23" fill="none">
            <path d="M6 12.5H12M6 16.5H9M1 3.5V19.5C1 20.0304 1.21071 20.5391 1.58579 20.9142C1.96086 21.2893 2.46957 21.5 3 21.5H15C15.5304 21.5 16.0391 21.2893 16.4142 20.9142C16.7893 20.5391 17 20.0304 17 19.5V7.842C17 7.57556 16.9467 7.31181 16.8433 7.06624C16.7399 6.82068 16.5885 6.59824 16.398 6.412L11.958 2.07C11.5844 1.70466 11.0826 1.50007 10.56 1.5H3C2.46957 1.5 1.96086 1.71071 1.58579 2.08579C1.21071 2.46086 1 2.96957 1 3.5Z" stroke={isActive ? "white" : "black"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11 1.5V5.5C11 6.03043 11.2107 6.53914 11.5858 6.91421C11.9609 7.28929 12.4696 7.5 13 7.5H17" stroke={isActive ? "white" : "black"} stroke-width="2" stroke-linejoin="round" />
        </svg>
    )

    const iconHistory = (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path d="M13.5 24.5C11.05 24.5 8.88194 23.7564 6.99583 22.2693C5.10972 20.7822 3.88472 18.8813 3.32083 16.5667C3.24306 16.275 3.30139 16.0078 3.49583 15.7652C3.69028 15.5225 3.95278 15.3813 4.28333 15.3417C4.59444 15.3028 4.87639 15.3611 5.12917 15.5167C5.38194 15.6722 5.55694 15.9056 5.65417 16.2167C6.12083 17.9667 7.08333 19.3958 8.54167 20.5042C10 21.6125 11.6528 22.1667 13.5 22.1667C15.775 22.1667 17.7051 21.3745 19.2902 19.7902C20.8753 18.2058 21.6674 16.2758 21.6667 14C21.6659 11.7242 20.8737 9.79456 19.2902 8.211C17.7066 6.62744 15.7766 5.83489 13.5 5.83333C12.1583 5.83333 10.9042 6.14444 9.7375 6.76667C8.57083 7.38889 7.58889 8.24444 6.79167 9.33333H8.83333C9.16389 9.33333 9.44117 9.44533 9.66517 9.66933C9.88917 9.89333 10.0008 10.1702 10 10.5C9.99922 10.8298 9.88722 11.1071 9.664 11.3318C9.44078 11.5566 9.16389 11.6682 8.83333 11.6667H4.16667C3.83611 11.6667 3.55922 11.5547 3.336 11.3307C3.11278 11.1067 3.00078 10.8298 3 10.5V5.83333C3 5.50278 3.112 5.22589 3.336 5.00267C3.56 4.77944 3.83689 4.66744 4.16667 4.66667C4.49644 4.66589 4.77372 4.77789 4.9985 5.00267C5.22328 5.22744 5.33489 5.50433 5.33333 5.83333V7.40833C6.325 6.16389 7.53561 5.20139 8.96517 4.52083C10.3947 3.84028 11.9063 3.5 13.5 3.5C14.9583 3.5 16.3245 3.77728 17.5985 4.33183C18.8725 4.88639 19.9808 5.63461 20.9235 6.5765C21.8662 7.51839 22.6148 8.62672 23.1693 9.9015C23.7239 11.1763 24.0008 12.5424 24 14C23.9992 15.4576 23.7223 16.8237 23.1693 18.0985C22.6163 19.3733 21.8677 20.4816 20.9235 21.4235C19.9793 22.3654 18.8709 23.114 17.5985 23.6693C16.3261 24.2247 14.9599 24.5016 13.5 24.5ZM14.6667 13.5333L17.5833 16.45C17.7972 16.6639 17.9042 16.9361 17.9042 17.2667C17.9042 17.5972 17.7972 17.8694 17.5833 18.0833C17.3694 18.2972 17.0972 18.4042 16.7667 18.4042C16.4361 18.4042 16.1639 18.2972 15.95 18.0833L12.6833 14.8167C12.5667 14.7 12.4792 14.5689 12.4208 14.4235C12.3625 14.2781 12.3333 14.1272 12.3333 13.9708V9.33333C12.3333 9.00278 12.4453 8.72589 12.6693 8.50267C12.8933 8.27944 13.1702 8.16744 13.5 8.16667C13.8298 8.16589 14.1071 8.27789 14.3318 8.50267C14.5566 8.72745 14.6682 9.00433 14.6667 9.33333V13.5333Z" fill={isActive ? "white" : "black"} />
        </svg>
    )

    const iconCalender = (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4ZM20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V12H20V19ZM20 10H4V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7V10Z" fill={isActive ? "white" : "black"} />
        </svg>
    )

    return (
        <UserLayout>
            <div className="flex flex-col lg:flex-row w-full h-full gap-5 bg-[#F7F7F7]">
                {/* Desktop Sidebar */}
                <motion.div
                    initial={false}
                    animate={{
                        minWidth: isSidebarOpen ? '300px' : '73px',
                        width: isSidebarOpen ? '300px' : '73px',
                        maxWidth: isSidebarOpen ? '300px' : '73px',
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-white border-r border-slate-300 shadow-md p-2 sm:p-4
                     h-full overflow-y-auto hide-scrollbar fixed z-10 top-[60px] sm:top-[6.8rem] lg:top-20 bottom-0 hidden md:block"
                >
                    {/* Nội dung */}
                    <div className="inline-flex w-full flex-row justify-between items-center">

                        <motion.div
                            initial={false}
                            animate={{
                                opacity: isSidebarOpen ? 1 : 0,
                                width: isSidebarOpen ? 'auto' : 0
                            }}
                            transition={{
                                duration: 0.2,
                                ease: [0.25, 0.1, 0.25, 1.0]
                            }}
                            className="text-center truncate text-zinc-900 text-xl font-semibold font-bevietnam"
                        >
                            Quản lý học tập
                        </motion.div>
                        <div
                            className={`flex h-full items-center justify-center min-w-[24px] p-2 cursor-pointer hover:bg-gray-200 rounded-md `}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <svg className={` ${isSidebarOpen ? 'rotate-180' : ''
                                }`}
                                xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 12 10" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.29303 0.293031C6.48056 0.10556 6.73487 0.000244141 7.00003 0.000244141C7.26519 0.000244141 7.5195 0.10556 7.70703 0.293031L11.707 4.29303C11.8945 4.48056 11.9998 4.73487 11.9998 5.00003C11.9998 5.26519 11.8945 5.5195 11.707 5.70703L7.70703 9.70703C7.51843 9.88919 7.26583 9.98998 7.00363 9.98771C6.74143 9.98543 6.49062 9.88026 6.30521 9.69485C6.1198 9.50944 6.01464 9.25863 6.01236 8.99643C6.01008 8.73423 6.11087 8.48163 6.29303 8.29303L9.58603 5.00003L6.29303 1.70703C6.10556 1.5195 6.00024 1.26519 6.00024 1.00003C6.00024 0.734866 6.10556 0.480558 6.29303 0.293031Z" fill="black" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.293031 0.293031C0.480558 0.10556 0.734866 0.000244141 1.00003 0.000244141C1.26519 0.000244141 1.5195 0.10556 1.70703 0.293031L5.70703 4.29303C5.8945 4.48056 5.99982 4.73487 5.99982 5.00003C5.99982 5.26519 5.8945 5.5195 5.70703 5.70703L1.70703 9.70703C1.51843 9.88919 1.26583 9.98998 1.00363 9.98771C0.741432 9.98543 0.49062 9.88026 0.305212 9.69485C0.119804 9.50944 0.0146347 9.25863 0.0123563 8.99643C0.0100779 8.73423 0.110873 8.48163 0.293031 8.29303L3.58603 5.00003L0.293031 1.70703C0.10556 1.5195 0.000244141 1.26519 0.000244141 1.00003C0.000244141 0.734866 0.10556 0.480558 0.293031 0.293031Z" fill="black" />
                            </svg>
                        </div>
                    </div>
                    <hr className="w-full h-[1px] bg-neutral-200 my-4" />
                    <div className="self-stretch text-sm w-full rounded-md flex flex-col justify-start items-start gap-1">
                        <ButtonSidebar choice={choice} onClick={() => setChoice(0)} value={0} text="Lớp học hôm nay" icon={iconClass} isOpen={isSidebarOpen} count={classes?.length} scrollToRef={sectionRefs.class} />
                        <ButtonSidebar choice={choice} onClick={() => setChoice(1)} value={1} text="Lịch học của bạn" icon={iconCalender} isOpen={isSidebarOpen} scrollToRef={sectionRefs.schedule} />
                        <ButtonSidebar choice={choice} onClick={() => setChoice(2)} value={2} text="Bài tập chưa hoàn thành" icon={iconExercise} isOpen={isSidebarOpen} count={learningItems?.length} scrollToRef={sectionRefs.exercise} />
                        <ButtonSidebar choice={choice} onClick={() => setChoice(3)} value={3} text="Lịch sử làm bài" icon={iconHistory} isOpen={isSidebarOpen} count={totalItems} scrollToRef={sectionRefs.history} />
                        <ButtonSidebar choice={choice} onClick={() => setChoice(4)} value={4} text="Đề thi của bạn" icon={iconSaveExam} isOpen={isSidebarOpen} count={exams.length} scrollToRef={sectionRefs.exams} />
                    </div>

                </motion.div>
                <div className={`flex flex-col p-3 sm:p-4 gap-4 w-full ${isSidebarOpen ? 'md:ml-[300px]' : 'md:ml-[73px]'} transition-all duration-300`}>
                    <div ref={sectionRefs.class} className="justify-start text-black text-lg sm:text-xl md:text-2xl font-semibold font-bevietnam">
                        Lớp học hôm nay - {classes?.length}
                    </div>

                    <div className="flex flex-col sm:flex-row p-3 sm:p-4 gap-3 sm:gap-4 w-full bg-white overflow-x-auto outline-gray-200 outline outline-1 outline-offset-[-1px] rounded-md">
                        {loadingClass ? (
                            <div className="flex items-center justify-center w-full h-full">
                                <LoadingSpinner
                                    type="dots"
                                    color="border-blue-600"
                                    size="4rem"
                                    showText={true}
                                    text="Đang tải danh sách lớp học..."
                                />
                            </div>
                        ) : (
                            classes && classes.length > 0) ? classes.map((cls) => (
                                <ClassCard key={cls.class?.id} dayOfWeek={codes['dow']?.find((code) => code.code === cls.class?.dayOfWeek)?.description || "Chưa cập nhật"} name={cls.class?.name} studyTime={cls.class?.studyTime} onClick={() => navigate(`/class/${cls.class?.class_code}`)} />
                            )) : (
                            <div className="flex items-center flex-col justify-center p-4 w-full h-full">
                                <img src={NoDataFound} alt="No Data Found" className="w-[8rem]" />
                                <p className="text-gray-500 text-sm sm:text-base md:text-lg">Không có lớp nào</p>
                            </div>
                        )}

                    </div>
                    <hr className="w-full h-[1px] bg-neutral-200 my-4" />
                    <div ref={sectionRefs.schedule} className="justify-start text-black text-lg sm:text-xl md:text-2xl font-semibold font-bevietnam">
                        Lịch học
                    </div>
                    {loadingClass ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <LoadingSpinner
                                type="dots"
                                color="border-blue-600"
                                size="4rem"
                                showText={true}
                                text="Đang tải lịch học..."
                            />
                        </div>
                    ) : (
                        classes && classes.length > 0 && classes[0].class && (
                            <Schedule classes={classes?.map((cls) => cls.class)} />
                        ))}

                    <hr className="w-full h-[1px] bg-neutral-200 my-4" />
                    <div ref={sectionRefs.exercise} className="justify-start text-black text-lg sm:text-xl md:text-2xl font-semibold font-bevietnam">
                        Bài tập chưa hoàn thành - {learningItems?.length}
                    </div>
                    {loadingLearningItem ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <LoadingSpinner
                                type="dots"
                                color="border-blue-600"
                                size="4rem"
                                showText={true}
                                text="Đang tải bài tập..."
                            />
                        </div>
                    ) : (
                        <>
                        {/* Desktop view for Bài tập chưa hoàn thành */}
                        <div className="hidden sm:flex self-stretch bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex-col justify-start items-start overflow-hidden">
                            <div className="self-stretch p-2 bg-white shadow-[inset_0px_-1px_0px_0px_rgba(231,231,237,1.00)] inline-flex justify-start items-center overflow-hidden">
                                <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Header" className="flex-1 flex justify-start items-start">
                                    <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                        <div className="flex-1 inline-flex flex-col justify-start items-start">
                                            <div className="self-stretch justify-center text-gray-800 font-normal font-bevietnam leading-relaxed">Tên tài liệu</div>
                                        </div>
                                    </div>
                                </div>
                                <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Header" className="flex-1 flex justify-start items-start">
                                    <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                        <div className="flex-1 inline-flex flex-col justify-start items-start">
                                            <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-relaxed">Lớp</div>
                                        </div>
                                    </div>
                                </div>
                                <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Header" className="flex-1 flex justify-center items-start">
                                    <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                        <div className="flex-1 inline-flex flex-col justify-start items-start">
                                            <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-relaxed">Trạng thái</div>
                                        </div>
                                    </div>
                                </div>
                                <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Header" className="flex-1 flex justify-start items-start">
                                    <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                        <div className="flex-1 inline-flex flex-col justify-start items-start">
                                            <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-relaxed">Ngày đăng</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {!learningItems || learningItems.length === 0 && (
                                <div className="flex items-center flex-col justify-center p-4 w-full h-full">
                                    <img src={NoDataFound} alt="No Data Found" className="w-[8rem]" />
                                    <p className="text-gray-500 text-sm sm:text-base md:text-lg">Không có bài tập nào</p>
                                </div>
                            )}
                            {learningItems && learningItems.length > 0 && learningItems.map((learningItem) => (
                                <div
                                    key={learningItem.learningItem?.id}
                                    onClick={() => navigate(`/class/${learningItem.learningItem?.lesson?.class?.class_code}/learning`)}
                                    className="self-stretch p-2 inline-flex justify-start items-start overflow-hidden hover:bg-gray-100 cursor-pointer">
                                    <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Row" className="flex-1 flex justify-start items-start">
                                        <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                <div className="self-stretch justify-center text-gray-800 font-semibold font-bevietnam leading-loose">{learningItem.learningItem?.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Row" className="flex-1 flex justify-start items-start">
                                        <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-loose">{learningItem.learningItem?.lesson?.class?.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div data-2nd-text="False" data-content="Label" data-icon-left="False" data-icon-right="False" data-type="Row" className="flex-1 flex justify-center items-start">
                                        <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                            <div className="px-3 py-[3px] bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-rose-600 inline-flex flex-col justify-start items-center">
                                                <div className="justify-center text-red-700 text-base font-semibold font-bevietnam leading-normal">Chưa hoàn thành</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Row" className="flex-1 flex justify-start items-start">
                                        <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-loose">{formatDate(learningItem.learningItem?.createdAt)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile view for Bài tập chưa hoàn thành */}
                        <div className="sm:hidden">
                            {!learningItems || learningItems.length === 0 && (
                                <div className="flex items-center flex-col justify-center p-4 w-full h-full">
                                    <img src={NoDataFound} alt="No Data Found" className="w-[8rem]" />
                                    <p className="text-gray-500 text-sm">Không có bài tập nào</p>
                                </div>
                            )}
                            {learningItems && learningItems.length > 0 && learningItems.map((learningItem) => (
                                <div
                                    key={learningItem.learningItem?.id}
                                    onClick={() => navigate(`/class/${learningItem.learningItem?.lesson?.class?.class_code}/learning`)}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{learningItem.learningItem?.name}</h3>

                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Lớp:</span> {learningItem.learningItem?.lesson?.class?.name}
                                        </div>
                                        <div className="px-2 py-1 bg-white text-xs rounded-sm outline outline-1 outline-offset-[-1px] outline-rose-600 text-red-700 font-medium">
                                            Chưa hoàn thành
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        <span className="font-medium">Ngày đăng:</span> {formatDate(learningItem.learningItem?.createdAt)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        </>
                    )}

                    <hr className="w-full h-[1px] bg-neutral-200 my-4" />
                    <div ref={sectionRefs.history} className="justify-start text-black text-lg sm:text-xl md:text-2xl font-semibold font-bevietnam">
                        Lịch sử làm bài
                    </div>
                    {loadingAttempt ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <LoadingSpinner color="border-black" size="5rem" />
                        </div>
                    ) : (
                        <>
                            {/* Desktop view for Lịch sử làm bài */}
                            <div className="hidden sm:flex self-stretch rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-gray-200 flex-col justify-start items-start overflow-hidden">
                                <div className="self-stretch p-2 bg-white shadow-[inset_0px_-1px_0px_0px_rgba(231,231,237,1.00)] inline-flex justify-start items-center overflow-hidden">
                                    <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Header" className="min-w-16 flex justify-start items-start">
                                        <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                <div className="self-stretch justify-center text-gray-800 font-normal font-bevietnam leading-relaxed">STT</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Header" className="flex-1 flex justify-start items-start">
                                        <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-relaxed">Tên đề</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Header" className="flex-1 flex justify-center items-start">
                                        <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-relaxed">Thời gian hoàn thành</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Header" className="flex-1 flex justify-start items-start">
                                        <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-relaxed">Thời gian</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Header" className="flex-1 flex justify-start items-start">
                                        <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-relaxed">Điểm</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!attempts || attempts.length === 0 && (
                                    <div className="flex items-center flex-col justify-center p-4 w-full">
                                        <img src={NoDataFound} alt="No Data Found" className="w-[8rem]" />
                                        <p className="text-gray-500 text-sm sm:text-base md:text-lg">Không có lịch sử nào</p>
                                    </div>
                                )}
                                {attempts && attempts.length > 0 && attempts.map((attempt, index) => (
                                    <div
                                        key={attempt?.id}
                                        onClick={() => navigate(`/practice/exam/attempt/${attempt.id}/score`)}
                                        className="self-stretch p-2 inline-flex justify-start items-start overflow-hidden hover:bg-gray-100 cursor-pointer">
                                        <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Row" className="min-w-16 flex justify-start items-start">
                                            <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                                <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                    <div className="self-stretch justify-center text-gray-800 font-semibold font-bevietnam leading-loose">{(index + 1) + (currentPage-1) * 10 }</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Row" className="flex-1 flex justify-start items-start">
                                            <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                                <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                    <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-loose">{attempt?.exam?.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Row" className="flex-1 flex justify-start items-start">
                                            <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                                <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                    <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-loose">{formatDate(attempt?.endTime)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Row" className="flex-1 flex justify-start items-start">
                                            <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                                <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                    <div className="self-stretch text-center justify-center text-gray-800 font-normal font-bevietnam leading-loose">{attempt?.duration}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div data-2nd-text="False" data-content="Text" data-icon-left="False" data-icon-right="False" data-type="Row" className="flex-1 flex justify-start items-start">
                                            <div className="flex-1 self-stretch px-3 flex justify-center items-center gap-2 overflow-hidden">
                                                <div className="flex-1 inline-flex flex-col justify-start items-center">
                                                    <div className="px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200 shadow-sm">
                                                        <div className="text-center justify-center text-blue-700 font-semibold font-bevietnam leading-none text-base">
                                                            {(attempt?.score || attempt?.score === 0) ? attempt?.score : "Chưa có"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile view for Lịch sử làm bài */}
                            <div className="sm:hidden">
                                {!attempts || attempts.length === 0 && (
                                    <div className="flex items-center flex-col justify-center p-4 w-full">
                                        <img src={NoDataFound} alt="No Data Found" className="w-[8rem]" />
                                        <p className="text-gray-500 text-sm">Không có lịch sử nào</p>
                                    </div>
                                )}
                                {attempts && attempts.length > 0 && attempts.map((attempt, index) => (
                                    <div
                                        key={attempt?.id}
                                        onClick={() => navigate(`/practice/exam/attempt/${attempt.id}/score`)}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-gray-800 line-clamp-1">{attempt?.exam?.name}</h3>
                                            <div className="px-3 py-1.5 bg-blue-50 text-sm rounded-md text-blue-700 font-semibold border border-blue-200 shadow-sm">
                                                <span className="mr-1">Điểm:</span>
                                                <span className="text-base">{(attempt?.score || attempt?.score === 0 ) ? attempt?.score : "Chưa có"}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div>
                                                <span className="font-medium">STT:</span> {index + 1 + (currentPage - 1) * 10}
                                            </div>
                                            <div>
                                                <span className="font-medium">Thời gian:</span> {attempt?.duration}
                                            </div>
                                            <div className="col-span-2">
                                                <span className="font-medium">Hoàn thành:</span> {formatDate(attempt?.endTime)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={totalItems}
                                    limit={10}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>


                    )}
                    <div ref={sectionRefs.exams} className="justify-start text-black text-lg sm:text-xl md:text-2xl font-semibold font-bevietnam">
                        Đề thi đã lưu - {exams?.length || 0}
                    </div>

                    {/* Filter section */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                        <h3 className="text-base sm:text-lg font-medium mb-3">Bộ lọc</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Tên đề thi</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleFilterChange}
                                    placeholder="Tìm theo tên..."
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="chapter" className="text-sm font-medium text-gray-700 mb-1">Chương</label>
                                <select
                                    id="chapter"
                                    name="chapter"
                                    value={codes['chapter']?.find(c => c.code === filters.chapter)?.description || ''}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả chương</option>
                                    {uniqueChapters.map(chapter => (
                                        <option key={chapter} value={chapter}>{chapter}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="typeOfExam" className="text-sm font-medium text-gray-700 mb-1">Loại đề</label>
                                <select
                                    id="typeOfExam"
                                    name="typeOfExam"
                                    value={codes['exam type']?.find(c => c.code === filters.typeOfExam)?.description || ''}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả loại đề</option>
                                    {uniqueExamTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="class" className="text-sm font-medium text-gray-700 mb-1">Lớp</label>
                                <select
                                    id="class"
                                    name="class"
                                    value={codes['grade']?.find(c => c.code === filters.class)?.description || ''}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả lớp</option>
                                    {uniqueClasses.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => {
                                    setFilters({
                                        chapter: '',
                                        typeOfExam: '',
                                        class: '',
                                        name: ''
                                    });
                                    setSavedExamPage(1);
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md mr-2 transition-colors duration-200"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {loadingExam ? (
                        <div className="flex items-center justify-center w-full ">
                            <LoadingSpinner color="border-black" size="5rem" />
                        </div>
                    ) : (
                        !exams || exams.length === 0 ? (
                            <div className="flex items-center flex-col justify-center p-4 w-full">
                                <img src={NoDataFound} alt="No Data Found" className="w-[8rem]" />
                                <p className="text-gray-500 text-sm sm:text-base md:text-lg">Không có đề đã lưu nào</p>
                            </div>
                        ) : (
                            paginatedExams.length === 0 ? (
                                <div className="flex items-center flex-col justify-center p-4 w-full">
                                    <img src={NoDataFound} alt="No Data Found" className="w-[8rem]" />
                                    <p className="text-gray-500 text-sm sm:text-base md:text-lg">Không có đề đã lưu nào</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">

                                        {paginatedExams.map((examData) => (
                                            <ExamCard
                                                key={examData.exam?.id}
                                                exam={{
                                                    ...examData.exam,
                                                    id: examData.exam?.id,
                                                    isDone: examData.isDone,
                                                    isSave: true
                                                }}
                                                codes={codes}
                                            />
                                        ))}
                                    </div>

                                    <div className="mt-3 sm:mt-4">
                                        <Pagination
                                            currentPage={savedExamPage}
                                            totalItems={filteredExams?.length || 0}
                                            limit={examsPerPage}
                                            onPageChange={setSavedExamPage}
                                        />
                                    </div>
                                </>
                            )
                        )
                    )}
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center p-1 md:hidden z-20 shadow-md">
                    <button
                        onClick={() => {
                            setChoice(0);
                            if (sectionRefs.class?.current) {
                                const offset = 100;
                                const elementTop = sectionRefs.class.current.getBoundingClientRect().top + window.pageYOffset;
                                window.scrollTo({
                                    top: elementTop - offset,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        className={`flex flex-col items-center justify-center p-2 flex-1 ${choice === 0 ? 'bg-slate-700 text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors`}
                    >
                        {iconClass(choice === 0)}
                        <span className="text-xs mt-1">Lớp học</span>
                    </button>

                    <button
                        onClick={() => {
                            setChoice(1);
                            if (sectionRefs.schedule?.current) {
                                const offset = 100;
                                const elementTop = sectionRefs.schedule.current.getBoundingClientRect().top + window.pageYOffset;
                                window.scrollTo({
                                    top: elementTop - offset,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        className={`flex flex-col items-center justify-center p-2 flex-1 ${choice === 1 ? 'bg-slate-700 text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors`}
                    >
                        {iconCalender(choice === 1)}
                        <span className="text-xs mt-1">Lịch học</span>
                    </button>

                    <button
                        onClick={() => {
                            setChoice(2);
                            if (sectionRefs.exercise?.current) {
                                const offset = 100;
                                const elementTop = sectionRefs.exercise.current.getBoundingClientRect().top + window.pageYOffset;
                                window.scrollTo({
                                    top: elementTop - offset,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        className={`flex flex-col items-center justify-center p-2 flex-1 ${choice === 2 ? 'bg-slate-700 text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors`}
                    >
                        {iconExercise(choice === 2)}
                        <span className="text-xs mt-1">Bài tập</span>
                    </button>

                    <button
                        onClick={() => {
                            setChoice(3);
                            if (sectionRefs.history?.current) {
                                const offset = 100;
                                const elementTop = sectionRefs.history.current.getBoundingClientRect().top + window.pageYOffset;
                                window.scrollTo({
                                    top: elementTop - offset,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        className={`flex flex-col items-center justify-center p-2 flex-1 ${choice === 3 ? 'bg-slate-700 text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors`}
                    >
                        {iconHistory(choice === 3)}
                        <span className="text-xs mt-1">Lịch sử</span>
                    </button>

                    <button
                        onClick={() => {
                            setChoice(4);
                            if (sectionRefs.exams?.current) {
                                const offset = 100;
                                const elementTop = sectionRefs.exams.current.getBoundingClientRect().top + window.pageYOffset;
                                window.scrollTo({
                                    top: elementTop - offset,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        className={`flex flex-col items-center justify-center p-2 flex-1 ${choice === 4 ? 'bg-slate-700 text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors`}
                    >
                        {iconSaveExam(choice === 4)}
                        <span className="text-xs mt-1">Đề thi</span>
                    </button>
                </div>

                {/* Add padding to bottom of content on mobile to account for bottom nav */}
                <div className="h-16 sm:hidden"></div>
            </div>
        </UserLayout >
    )
}

export default OverViewPage