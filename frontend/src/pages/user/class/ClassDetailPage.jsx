import UserLayout from "../../../layouts/UserLayout"
import { useDispatch, useSelector } from "react-redux"
import { fetchLessonLearningItemInClass } from "../../../features/class/classSlice"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SlideShow from "../../../components/image/SlideShow"
import QrCode from "../../../components/QrCode"
import { fetchCodesByType } from "../../../features/code/codeSlice"
import { useNavigate } from "react-router-dom"
import { joinClass } from "../../../features/class/classSlice"
import LoadingSpinner from "../../../components/loading/LoadingSpinner"
import LearningItemIcon from "../../../components/image/LearningItemIcon"


const ClassDetailPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { classCode } = useParams()
    const { classDetail } = useSelector(state => state.classes)
    const { codes } = useSelector(state => state.codes)
    const { loading } = useSelector(state => state.states)
    const [loadingJoin, setLoadingJoin] = useState(false)
    const currentUrl = window.location.href;
    const images = classDetail?.slide?.slideImages?.map(img => img.imageUrl) || []
    const [openLessons, setOpenLessons] = useState([]);
    const toggleLesson = (index) => {
        setOpenLessons((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // nếu đang mở thì đóng lại
                : [...prev, index]               // nếu đang đóng thì mở ra
        );
    };
    const handleClicked = async () => {
        if (classDetail?.userStatus == "JS") {
            navigate(`/class/${classCode}/learning`)
        } else if (classDetail?.userStatus == "WS") {
            return
        } else {
            setLoadingJoin(true)
            await dispatch(joinClass(classCode))
            setLoadingJoin(false)
        }
    }


    useEffect(() => {
        if (classCode) dispatch(fetchLessonLearningItemInClass(classCode))
    }, [dispatch, classCode])


    useEffect(() => {
        dispatch(fetchCodesByType(['dow', 'duration']))
    }, [dispatch])

    return (
        <UserLayout>
            <div className="flex flex-col min-h-screen justify-center items-start gap-4 p-4 bg-[#F6FAFD]">
                <SlideShow images={images} interval={5000} text={classDetail?.name} h="h-[20rem]"/>
                <div className="w-full h-full flex flex-col lg:flex-row justify-center items-start gap-4">

                    <div className="flex-1 w-full inline-flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch px-7 py-4 bg-white rounded-md outline outline-1 outline-stone-300 flex flex-col justify-start items-start gap-2 overflow-hidden">
                            <div className="self-stretch justify-start text-zinc-900 text-2xl font-semibold font-['Be_Vietnam_Pro']">Mô tả</div>
                            <div className="self-stretch justify-start text-zinc-900 text-md font-normal font-['Be_Vietnam_Pro']">{classDetail?.description}</div>
                        </div>
                        <div className="self-stretch px-7 py-5 bg-white rounded-md outline outline-1 outline-stone-300 flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="justify-start  text-zinc-900 text-2xl font-semibold font-['Be_Vietnam_Pro'] mb-4">Nội dung</div>
                                {classDetail?.lessons?.map((lesson, index) => (
                                    <div key={index} className="self-stretch rounded-md flex flex-col justify-start items-start gap-1">
                                        {/* Lesson Header */}
                                        <div
                                            onClick={() => toggleLesson(index)}
                                            className={`cursor-pointer self-stretch p-4  ${openLessons.includes(index) ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'} rounded-md inline-flex justify-start items-center gap-2.5 transition `}
                                        >
                                            {
                                                lesson.learningItems?.length > 0 ? (
                                                    <svg
                                                        onClick={() => {
                                                            toggleLesson(index); // toggle mở/đóng
                                                        }}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="25"
                                                        viewBox="0 0 24 25"
                                                        fill="none"
                                                        className={`transform transition-transform duration-300 ${openLessons.includes(index) ? 'stroke-white' : 'rotate-180 stroke-black'}`}
                                                    >
                                                        <path d="M18 9.5L12 15.5L6 9.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        className={`transform transition-transform duration-300 ${openLessons.includes(index) ? 'stroke-white' : 'rotate-180 stroke-black'}`}
                                                    >
                                                        <path d="M12 4V20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )
                                            }
                                            <div className="justify-start  text-md font-medium font-['Be_Vietnam_Pro']">{lesson.name}</div>
                                        </div>

                                        {/* Lesson Content */}
                                        <div
                                            className={`flex flex-col transition-all duration-500 ease-in-out overflow-hidden w-full ${openLessons.includes(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            {lesson.learningItems?.map((learningItem, i) => (
                                                <div
                                                    key={i}
                                                    className="pl-12 pr-4 py-4 rounded-md inline-flex justify-start items-center gap-2.5"
                                                >
                                                    <LearningItemIcon type={learningItem.typeOfLearningItem} />
                                                    <div className="text-zinc-900 text-sm font-medium font-['Be_Vietnam_Pro']">
                                                        {learningItem.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {classDetail?.lessons?.length === 0 && (
                                    <div className="flex justify-center items-center h-full">
                                        <p className="text-gray-400">Không có buổi học nào</p>
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3 px-4 lg:px-9 py-6 bg-white rounded-md outline outline-1 outline-stone-300 inline-flex flex-col justify-start items-center gap-9 overflow-hidden">
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch justify-start text-black text-xl font-semibold font-['Be_Vietnam_Pro']">

                                Thông tin lớp học</div>
                            {/* Mã lớp */}
                            <div className="self-stretch justify-start flex flex-row items-center gap-2 text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 18 21" fill="none">
                                    <path d="M8 1.00268e-07C8.50458 -0.000159579 8.99057 0.190406 9.36055 0.533497C9.73053 0.876587 9.95716 1.34684 9.995 1.85L10 2V8C10.0002 8.50458 9.80959 8.99057 9.4665 9.36055C9.12341 9.73053 8.65315 9.95716 8.15 9.995L8 10H2C1.49542 10.0002 1.00943 9.80959 0.639452 9.4665C0.269471 9.12341 0.0428434 8.65315 0.00500021 8.15L1.00268e-07 8V2C-0.000159579 1.49542 0.190406 1.00943 0.533497 0.639452C0.876587 0.269471 1.34684 0.0428434 1.85 0.00500021L2 1.00268e-07H8Z
     M8 2H2V8H8V2Z
     M5.5 4C5.61703 3.99996 5.73036 4.04097 5.82026 4.11589C5.91016 4.19081 5.97094 4.29489 5.992 4.41L6 4.5V5.5C6.00004 5.61703 5.95903 5.73036 5.88411 5.82026C5.80919 5.91016 5.70511 5.97094 5.59 5.992L5.5 6H4.5C4.38297 6.00004 4.26964 5.95903 4.17974 5.88411C4.08984 5.80919 4.02906 5.70511 4.008 5.59L4 5.5V4.5C3.99996 4.38297 4.04097 4.26964 4.11589 4.17974C4.19081 4.08984 4.29489 4.02906 4.41 4.008L4.5 4H5.5Z
     M18 2C18 1.46957 17.7893 0.960859 17.4142 0.585786C17.0391 0.210714 16.5304 1.00268e-07 16 1.00268e-07H14C13.4696 1.00268e-07 12.9609 0.210714 12.5858 0.585786C12.2107 0.960859 12 1.46957 12 2V4C12 4.53043 12.2107 5.03914 12.5858 5.41421C12.9609 5.78929 13.4696 6 14 6H16C16.5304 6 17.0391 5.78929 17.4142 5.41421C17.7893 5.03914 18 4.53043 18 4V2Z
     M14 2H16V4H14V2Z
     M4 12C4.53043 12 5.03914 12.2107 5.41421 12.5858C5.78929 12.9609 6 13.4696 6 14V16C6 16.5304 5.78929 17.0391 5.41421 17.4142C5.03914 17.7893 4.53043 18 4 18H2C1.46957 18 0.960859 17.7893 0.585786 17.4142C0.210714 17.0391 1.00268e-07 16.5304 1.00268e-07 16V14C1.00268e-07 13.4696 0.210714 12.9609 0.585786 12.5858C0.960859 12.2107 1.46957 12 2 12H4ZM4 14H2V16H4V14Z
     M18 14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12H14C13.4696 12 12.9609 12.2107 12.5858 12.5858C12.2107 12.9609 12 13.4696 12 14V16C12 16.5304 12.2107 17.0391 12.5858 17.4142C12.9609 17.7893 13.4696 18 14 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V14ZM14 14H16V16H14V14Z
     M12 9C12 8.73478 12.1054 8.48043 12.2929 8.29289C12.4804 8.10536 12.7348 8 13 8H17C17.2652 8 17.5196 8.10536 17.7071 8.29289C17.8946 8.48043 18 8.73478 18 9C18 9.26522 17.8946 9.51957 17.7071 9.70711C17.5196 9.89464 17.2652 10 17 10H13C12.7348 10 12.4804 9.89464 12.2929 9.70711C12.1054 9.51957 12 9.26522 12 9ZM10 13C10 12.7348 9.89464 12.4804 9.70711 12.2929C9.51957 12.1054 9.26522 12 9 12C8.73478 12 8.48043 12.1054 8.29289 12.2929C8.10536 12.4804 8 12.7348 8 13V17C8 17.2652 8.10536 17.5196 8.29289 17.7071C8.48043 17.8946 8.73478 18 9 18C9.26522 18 9.51957 17.8946 9.70711 17.7071C9.89464 17.5196 10 17.2652 10 17V13Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <p className="text-md font-normal font-['Be_Vietnam_Pro']">Mã lớp: {classDetail?.class_code}</p>
                            </div>

                            {/* Số người đã tham gia */}
                            <div className="self-stretch justify-start flex flex-row items-center gap-2 text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M3.55398 13.7255H1.95048C1.80944 13.7277 1.66995 13.6958 1.54395 13.6323C1.41795 13.5689 1.30918 13.4759 1.22693 13.3613C1.14468 13.2467 1.0914 13.1139 1.07164 12.9742C1.05189 12.8346 1.06625 12.6922 1.11349 12.5593C1.52235 11.6841 2.16965 10.9419 2.98113 10.4179C3.7926 9.89394 4.73536 9.60933 5.70123 9.59676M5.70123 7.52751C5.3403 7.52761 4.98288 7.4566 4.64939 7.31855C4.3159 7.18049 4.01287 6.97809 3.75762 6.7229C3.50236 6.46772 3.29988 6.16475 3.16174 5.8313C3.02359 5.49785 2.95248 5.14045 2.95248 4.77951C2.9515 4.41794 3.02187 4.05974 3.15958 3.72542C3.29728 3.3911 3.49961 3.08725 3.75496 2.83127C4.01032 2.57529 4.31368 2.37221 4.64765 2.23369C4.98163 2.09516 5.33967 2.02391 5.70123 2.02401M9.99498 7.61376C9.16868 7.61177 8.37691 7.28208 7.79339 6.69702C7.20988 6.11196 6.88228 5.31932 6.88248 4.49301C6.88248 3.66733 7.21049 2.87546 7.79433 2.29161C8.37818 1.70776 9.17005 1.37976 9.99573 1.37976C10.8214 1.37976 11.6133 1.70776 12.1971 2.29161C12.781 2.87546 13.109 3.66733 13.109 4.49301C13.109 5.31932 12.7812 6.11188 12.1975 6.6968C11.6139 7.28172 10.822 7.61122 9.99573 7.61301M6.48123 14.6203C6.21706 14.6199 5.95813 14.5464 5.73315 14.408C5.50817 14.2695 5.3259 14.0715 5.20655 13.8358C5.08719 13.6001 5.03541 13.336 5.05693 13.0727C5.07845 12.8094 5.17244 12.5572 5.32848 12.344C5.87514 11.6184 6.57889 11.0258 7.38702 10.6107C8.19516 10.1956 9.08673 9.9687 9.99498 9.94701C10.9033 9.96879 11.7949 10.1958 12.6031 10.611C13.4112 11.0263 14.1149 11.619 14.6615 12.3448C14.817 12.5579 14.9106 12.81 14.9319 13.073C14.9531 13.336 14.9013 13.5998 14.7822 13.8352C14.663 14.0706 14.481 14.2685 14.2564 14.4071C14.0319 14.5456 13.7734 14.6194 13.5095 14.6203H6.48123Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-md font-normal font-['Be_Vietnam_Pro']">Số người đã tham gia: {classDetail?.joinedStudentCount}</p>
                            </div>

                            {/* Số buổi học */}
                            <div className="self-stretch justify-start flex flex-row items-center gap-2 text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M8.475 15C8.55 15.25 8.65325 15.5095 8.78475 15.7785C8.91625 16.0475 9.0505 16.288 9.1875 16.5H3.75C3.3375 16.5 2.9845 16.3533 2.691 16.0598C2.3975 15.7663 2.2505 15.413 2.25 15V3C2.25 2.5875 2.397 2.2345 2.691 1.941C2.985 1.6475 3.338 1.5005 3.75 1.5H12.75C13.1625 1.5 13.5158 1.647 13.8098 1.941C14.1038 2.235 14.2505 2.588 14.25 3V8.325C14.025 8.3 13.775 8.2875 13.5 8.2875C13.225 8.2875 12.975 8.3 12.75 8.325V3H9V8.25L7.125 7.125L5.25 8.25V3H3.75V15H8.475ZM13.5 17.25C12.4625 17.25 11.5783 16.8843 10.8473 16.1528C10.1163 15.4213 9.7505 14.537 9.75 13.5C9.7495 12.463 10.1153 11.5788 10.8473 10.8473C11.5793 10.1158 12.4635 9.75 13.5 9.75C14.5365 9.75 15.421 10.1158 16.1535 10.8473C16.886 11.5788 17.2515 12.463 17.25 13.5C17.2485 14.537 16.8828 15.4215 16.1528 16.1535C15.4228 16.8855 14.5385 17.251 13.5 17.25ZM12.5625 15.375L15.5625 13.5L12.5625 11.625V15.375ZM8.475 3H3.75H12.75H8.25H8.475Z" fill="currentColor" />
                                </svg>
                                <p className="text-md font-normal font-['Be_Vietnam_Pro']">{classDetail?.lessons?.length} buổi</p>
                            </div>
                            <div className="self-stretch justify-start flex flex-row items-center gap-2 text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14 15" fill="none">
                                    <path d="M6.99992 0.333374C10.6819 0.333374 13.6666 3.31804 13.6666 7.00004C13.6666 10.682 10.6819 13.6667 6.99992 13.6667C3.31792 13.6667 0.333252 10.682 0.333252 7.00004C0.333252 3.31804 3.31792 0.333374 6.99992 0.333374ZM6.99992 1.66671C5.58543 1.66671 4.22888 2.22861 3.22868 3.2288C2.22849 4.229 1.66659 5.58555 1.66659 7.00004C1.66659 8.41453 2.22849 9.77108 3.22868 10.7713C4.22888 11.7715 5.58543 12.3334 6.99992 12.3334C8.41441 12.3334 9.77096 11.7715 10.7712 10.7713C11.7713 9.77108 12.3333 8.41453 12.3333 7.00004C12.3333 5.58555 11.7713 4.229 10.7712 3.2288C9.77096 2.22861 8.41441 1.66671 6.99992 1.66671ZM6.99992 3.00004C7.16321 3.00006 7.32081 3.06001 7.44283 3.16852C7.56486 3.27702 7.64281 3.42654 7.66192 3.58871L7.66658 3.66671V6.72404L9.47125 8.52871C9.59082 8.64868 9.66023 8.80966 9.6654 8.97896C9.67057 9.14826 9.61111 9.31318 9.49909 9.44023C9.38706 9.56727 9.23088 9.64691 9.06227 9.66297C8.89365 9.67904 8.72525 9.63031 8.59125 9.52671L8.52858 9.47137L6.52859 7.47137C6.42497 7.36767 6.35843 7.23271 6.33925 7.08737L6.33325 7.00004V3.66671C6.33325 3.4899 6.40349 3.32033 6.52851 3.1953C6.65354 3.07028 6.82311 3.00004 6.99992 3.00004Z" fill="currentColor" />
                                </svg>
                                <p className="text-md font-normal font-['Be_Vietnam_Pro']">{codes['dow']?.find((code) => code.code === classDetail?.dayOfWeek)?.description} {codes['duration']?.find((code) => code.code === classDetail?.studyTime)?.description}</p>
                            </div>

                        </div>
                        <div className="self-stretch flex flex-col justify-start items-center gap-3">
                            <QrCode url={currentUrl} size={150} />
                            <div className="self-stretch text-center justify-start text-zinc-900 text-md font-normal font-['Be_Vietnam_Pro']">QR lớp học</div>
                        </div>
                        <button
                            onClick={handleClicked}
                            data-property-1="Tham gia"
                            className={`self-stretch py-4 rounded-md inline-flex justify-center items-center transition-colors duration-300
    ${classDetail?.userStatus === 'JS'
                                    ? 'bg-green-600 text-white'
                                    : classDetail?.userStatus === 'WS'
                                        ? 'bg-yellow-500 text-black'
                                        : 'bg-slate-700 text-white'
                                }
  `}
                        >
                            <div className="text-sm font-medium font-['Be_Vietnam_Pro']">
                                {loadingJoin ? (
                                    <LoadingSpinner size="0.875rem" />
                                ) : (
                                    classDetail?.userStatus === 'JS' ? (
                                        "Vào học ngay"
                                    ) : classDetail?.userStatus === 'WS' ? (
                                        "Chờ phê duyệt"
                                    ) : (
                                        "Tham gia lớp học"
                                    )
                                )}

                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/class')}
                            className="self-stretch text-center justify-start text-zinc-900 text-md font-normal font-['Be_Vietnam_Pro']">Quay lại danh sách lớp học</button>
                    </div>
                </div>
            </div>

        </UserLayout>
    )

}

export default ClassDetailPage