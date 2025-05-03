import UserLayoutHome from "../../../layouts/UserLayoutHome";
import TeacherImage from "../../../assets/images/teacherImage.jpg";
import CountDownCard from "../../../components/card/countDownCard";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import SlideShow from "../../../components/image/SlideShow";
import CustomSchedule from "../../../components/CustomSchedule";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import StudentThoughts from "../../../components/StudentThoughts";
import { checkLogin } from "../../../features/auth/authSlice";
import { fetchClassesPublic } from "../../../features/class/classSlice";
import { fetchCodesByType } from "../../../features/code/codeSlice";
import { fetchNewestArticle } from "../../../features/article/articleSlice";
import { fetchNewestExams } from "../../../features/exam/examSlice";
import { fetchImagesFolders } from "../../../features/image/imageSlice";
import MessageIcon from "../../../assets/icons/64px-Facebook_Messenger_logo_2020.svg.png";
import { CalendarClock, Newspaper, Flag, Award, BookOpen, Camera, CalendarDays, Video, FileText, PenTool, Calculator, Users, Brain, GraduationCap, Lightbulb, MessageCircle, HelpCircle, Contact, Phone, HeadphonesIcon, Headphones } from "lucide-react";
import { formatDate } from "../../../utils/formatters";
import AchievementSection from "../../../components/achievement/AchievementSection";


import banner1 from "../../../assets/images/448442239_2773856989430721_8578743624183224087_n.jpg";
import banner2 from "../../../assets/images/448712528_2777775295705557_6902967523121265908_n.jpg";
import banner3 from "../../../assets/images/448765305_2776991819117238_2057468535959693814_n.jpg";
import banner4 from "../../../assets/images/448843372_2776845152465238_5807408113166692154_n.jpg";
import tongon from "../../../assets/images/tongon.jpg";
import luyende from "../../../assets/images/luyende.jpg";

import calender12 from "../../../assets/images/calender12.jpg";
import calender11 from "../../../assets/images/calender11.jpg";
import calender10 from "../../../assets/images/calender10.jpg";
import calender9 from "../../../assets/images/calender9.jpg";



import banner304151 from "../../../assets/images/304151.jpg";
import banner304152 from "../../../assets/images/304152.jpg";
import banner304153 from "../../../assets/images/304153.jpg";


const calenderSlides = [luyende, tongon, calender12, calender11, calender10, calender9];
const slideImages = [banner1, banner2, banner3, banner4];
const bannerSlides = [banner304152, banner304153];

// Student thoughts data
const studentThoughts2022 = [
    { content: "\"Thầy Bee dạy rất dễ hiểu, giúp em từ học sinh trung bình trở thành học sinh khá giỏi môn Toán.\"", student: "Nguyễn Đức Dương" },
    { content: "\"Nhờ phương pháp giảng dạy của thầy, em đã đạt 9.0 trong kỳ thi THPT Quốc gia.\"", student: "Nguyễn Hoàng Anh" },
    { content: "\"Các bài giảng của thầy luôn đi từ cơ bản đến nâng cao, giúp em tiến bộ rất nhiều.\"", student: "Trần Minh Phương" },
];

const studentThoughts2023 = [
    { content: "\"Thầy không chỉ dạy kiến thức mà còn truyền cảm hứng cho chúng em yêu thích môn Toán.\"", student: "Phạm Thị Minh Trang" },
    { content: "\"Nhờ thầy mà em đã vượt qua nỗi sợ hãi với môn Toán và đạt điểm cao trong kỳ thi.\"", student: "Nguyễn Quốc Cường" },
    { content: "\"Phương pháp giải nhanh của thầy giúp em tiết kiệm rất nhiều thời gian trong các bài thi.\"", student: "Ngô Hương Giang" },
];

const studentThoughts2024 = [
    { content: "\"Thầy luôn tạo không khí học tập vui vẻ nhưng hiệu quả, giúp em tiến bộ rất nhiều.\"", student: "Đỗ Hoàng Dũng" },
    { content: "\"Cách thầy phân tích bài toán rất logic và dễ hiểu, giúp em tự tin hơn khi làm bài.\"", student: "Hoàng Việt Hoàng" },
    { content: "\"Em rất biết ơn thầy đã giúp em đạt được ước mơ vào trường đại học mong muốn.\"", student: "Nguyễn Minh Đức" },
];



// Vietnam flag colors
const vnRedColor = "#E30A17";
const vnYellowColor = "#FFFF00";

const MomentCard = ({ year, images, icon: Icon = CalendarDays, color = "text-blue-500", interval = 4000, thoughts, reverse = false }) => {
    // Create slideshow component
    const SlideShowCard = () => (
        <div className="relative bg-white shadow-xl rounded-xl p-4">
            {/* Băng dính trái */}
            <div className="absolute top-0 left-4 w-12 h-5 bg-yellow-200 rotate-[-10deg] rounded-sm shadow-md z-10"></div>

            {/* Băng dính phải */}
            <div className="absolute top-0 right-4 w-12 h-5 bg-yellow-200 rotate-[10deg] rounded-sm shadow-md z-10"></div>

            {/* Tiêu đề */}
            <div className={`flex items-center gap-2 text-lg sm:text-xl font-bold font-cubano ${color} mb-2 justify-center`}>
                <Icon className="w-5 h-5" />
                {year}
            </div>

            {/* Slide ảnh */}
            <div className="w-full rounded-lg overflow-hidden border-4 border-white shadow-md">
                <SlideShow interval={interval} images={images} h="h-[15rem] sm:h-[18rem] lg:h-[22rem]" />
            </div>
        </div>
    );

    // Create thoughts component
    const ThoughtsCard = () => (
        <div className="h-full">
            <StudentThoughts thoughts={thoughts || []} />
        </div>
    );

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {reverse ? (
                    // Reversed layout: Thoughts on left, Slideshow on right
                    <>
                        <ThoughtsCard />
                        <SlideShowCard />
                    </>
                ) : (
                    // Default layout: Slideshow on left, Thoughts on right
                    <>
                        <SlideShowCard />
                        <ThoughtsCard />
                    </>
                )}
            </div>
        </div>
    );
};

const BannerWrapper = ({ bannerImages }) => {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        if (bannerImages?.length > 0) {
            const img = new Image();
            img.src = bannerImages[0];
            img.onload = () => {
                setIsPortrait(img.height > img.width);
            };
        }
    }, [bannerImages]);

    return (
        <div className="flex items-center h-full">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className={`w-full ${isPortrait ? 'max-w-[25rem]' : 'max-w-[50rem]'} flex h-full lg:justify-center items-center justify-center`}
            >
                <SlideShow interval={4000} images={bannerImages} h="h-fit" />
            </motion.div>
        </div>
    );
};

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const { articles } = useSelector((state) => state.articles);


    const { exams } = useSelector((state) => state.exams);
    const { imagesHome } = useSelector((state) => state.images);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [bannerImages, setBannerImages] = useState([]);
    const [calendarImages, setCalendarImages] = useState([]);
    const [momentImages2022, setMomentImages2022] = useState([]);
    const [momentImages2023, setMomentImages2023] = useState([]);
    const [momentImages2024, setMomentImages2024] = useState([]);


    useEffect(() => {
        if (!user) {
            dispatch(checkLogin());
        }
    }, [user, dispatch]);

    useEffect(() => {
        dispatch(fetchClassesPublic());
        dispatch(fetchCodesByType(["class status", "year", "dow", "duration"]));
        dispatch(fetchNewestArticle());
        dispatch(fetchNewestExams());
        dispatch(fetchImagesFolders(["home_banner", "home_calendar", "home_moment_2022", "home_moment_2023", "home_moment_2024"]));
    }, [dispatch]);

    useEffect(() => {
        if (imagesHome) {
            const bannerImgs = imagesHome[0]
            const calendarImgs = imagesHome[1]
            const moment2022Imgs = imagesHome[2]
            const moment2023Imgs = imagesHome[3]
            const moment2024Imgs = imagesHome[4]
            setBannerImages(bannerImgs);
            setCalendarImages(calendarImgs);
            setMomentImages2022(moment2022Imgs);
            setMomentImages2023(moment2023Imgs);
            setMomentImages2024(moment2024Imgs);
        }
    }, [imagesHome]);


    return (
        <UserLayoutHome>
            <div className="relative ">
                {/* Holiday Banner for April 30th/May 1st */}
                <section
                    style={{
                        background: `linear-gradient(to right, ${vnRedColor}, ${vnYellowColor})`,
                    }}
                    className="w-full py-2 sm:py-4 text-white"
                >
                    <div className="max-w-screen-xl mx-auto px-2 sm:px-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                        {/* Dòng text chính */}
                        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center md:text-left">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M16 2.5H2C1.46957 2.5 0.960859 2.71071 0.585786 3.08579C0.210714 3.46086 0 3.96957 0 4.5L0 13.5C0 14.0304 0.210714 14.5391 0.585786 14.9142C0.960859 15.2893 1.46957 15.5 2 15.5H16C16.5304 15.5 17.0391 15.2893 17.4142 14.9142C17.7893 14.5391 18 14.0304 18 13.5V4.5C18 3.96957 17.7893 3.46086 17.4142 3.08579C17.0391 2.71071 16.5304 2.5 16 2.5Z" fill="#DA251D" />
                                <path d="M9.8766 8.0183L9.0001 5.3208L8.1236 8.0183H5.2876L7.5821 9.6848L6.7056 12.3823L9.0001 10.7153L11.2946 12.3823L10.4181 9.6848L12.7126 8.0183H9.8766Z" fill="#FFFF00" />
                            </svg>
                            <span className="font-bold text-sm sm:text-base">
                                Kỷ niệm 50 năm Ngày Giải phóng miền Nam,
                                {/* xuống dòng chỉ trên mobile */}
                                <br className="md:hidden" />
                                thống nhất đất nước
                            </span>
                        </div>

                        {/* Phần ngày tháng */}
                        <div className="flex items-center text-xs sm:text-sm">
                            <span className="ml-2 text-red-700">30/4/1975 – 30/4/2025</span>
                        </div>
                    </div>
                </section>


                <section
                    id="home"
                    // className="bg-gradient-to-b from-red-700 via-red-600 to-yellow-400 lg:h-[100vh]"
                    className="bg-gradient-to-b from-white to-[#E0F7FA]"
                >
                    <div className="flex flex-col-reverse lg:h-[45rem] lg:flex-row justify-center items-center gap-12 lg:gap-18 px-6 pb-10">
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2 }}
                            className="w-full lg:w-fit flex justify-center items-center lg:justify-end lg:items-end gap-6"
                        >
                            <div className="flex flex-col justify-center gap-4">
                                {/* <div className="flex justify-center items-center lg:justify-start flex-col lg:items-start text-5xl sm:text-6xl lg:text-7xl text-start font-normal font-cubano leading-tight">
                                    <div className="flex flex-row gap-4">
                                        <span className="text-red-200">Học </span>
                                        <span className="text-yellow-300">thầy Bee<br /></span>
                                    </div>

                                    <span className="text-red-200">Toán easy</span>
                                </div>

                                <div className="rounded-full w-full flex justify-center lg:justify-start items-center gap-4">
                                    <button
                                        onClick={() => user ? navigate("/practice") : navigate("/login")}
                                        className="px-8 py-3 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full shadow-lg text-white text-xl sm:text-2xl font-bold font-['Be_Vietnam_Pro']"
                                    >
                                        Vào học ngay
                                    </button>
                                </div> */}
                                <div className="text-5xl sm:text-6xl lg:text-7xl text-start font-normal font-cubano leading-tight">
                                    <span className="text-zinc-800">Học </span>
                                    <span className="text-blue-400">thầy Bee<br /></span>
                                    <span className="text-zinc-800">Toán easy</span>



                                </div>

                                <div className="rounded-full w-full flex justify-center lg:justify-start items-center gap-4">
                                    <button
                                        onClick={() => user ? navigate("/practice") : navigate("/login")}
                                        className="px-8 py-3 bg-gradient-to-r from-teal-400 to-sky-300 rounded-full shadow-lg text-white text-xl sm:text-2xl font-bold font-['Be_Vietnam_Pro']">

                                        Vào học ngay
                                    </button>
                                </div>

                                <ul className="list-disc pl-6 text-base lg:text-lg text-slate-700 font-['Be_Vietnam_Pro'] space-y-2 mt-4">                                    <li>
                                    Giáo viên tại{" "}
                                    <a
                                        href="https://vuihoc.vn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold text-teal-600 hover:text-teal-800 hover:underline"
                                    >
                                        Vuihoc.vn
                                    </a>
                                </li>
                                    <li>
                                        Giáo viên tại{" "}
                                        <a
                                            href="https://hocmai.vn"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-purple-600 hover:text-purple-800 hover:underline"
                                        >
                                            Hệ thống Giáo dục HOCMAI
                                        </a>
                                    </li>
                                    <li>
                                        Giáo viên tại{" "}
                                        <a
                                            href="https://anhxtanh.edu.vn"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-rose-500 hover:text-rose-800 hover:underline"
                                        >
                                            THPT Anhxtanh – Hà Nội
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        <BannerWrapper bannerImages={bannerImages} />
                    </div>
                </section>





                {/* Holiday Special Section */}


                {/* 🔽 Tính năng Section */}
                <section id="features" className="w-full px-4 py-16 bg-gradient-to-b from-white to-[#E0F7FA] overflow-hidden">
                    <div className="max-w-screen-xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-cubano mb-4">Tính năng nổi bật</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Khám phá các tính năng đa dạng giúp việc học toán trở nên dễ dàng, hiệu quả và thú vị hơn bao giờ hết.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
                                    <BookOpen className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Tài liệu học tập</h3>
                                <p className="text-gray-600 lg:block hidden text-sm text-center">Truy cập kho tài liệu phong phú với đầy đủ lý thuyết và bài tập theo từng chương trình học.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto group-hover:bg-red-200 transition-colors">
                                    <Video className="w-7 h-7 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Video bài giảng</h3>
                                <p className="text-gray-600 lg:block hidden text-sm text-center">Xem các video bài giảng chất lượng cao với phương pháp giảng dạy dễ hiểu và trực quan.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto group-hover:bg-green-200 transition-colors">
                                    <FileText className="w-7 h-7 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Đề thi & Bài tập</h3>
                                <p className="text-gray-600 lg:block hidden text-sm text-center">Luyện tập với ngân hàng đề thi và bài tập đa dạng từ cơ bản đến nâng cao.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                                    <PenTool className="w-7 h-7 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Luyện thi online</h3>
                                <p className="text-gray-600 lg:block hidden text-sm text-center">Tham gia các bài kiểm tra trực tuyến với đánh giá chi tiết và phản hồi ngay lập tức.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-4 mx-auto group-hover:bg-yellow-200 transition-colors">
                                    <Calculator className="w-7 h-7 text-yellow-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Công cụ tính toán</h3>
                                <p className="text-gray-600 lg:block hidden text-sm text-center">Sử dụng các công cụ tính toán thông minh giúp giải quyết bài toán nhanh chóng và chính xác.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4 mx-auto group-hover:bg-teal-200 transition-colors">
                                    <Users className="w-7 h-7 text-teal-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Lớp học đa dạng</h3>
                                <p className="text-gray-600 lg:block hidden text-sm text-center">Tham gia các lớp học tập để trao đổi kiến thức và giải đáp thắc mắc cùng bạn bè.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-4 mx-auto group-hover:bg-pink-200 transition-colors">
                                    <Brain className="w-7 h-7 text-pink-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Phương pháp học</h3>
                                <p className="text-gray-600 lg:block hidden text-sm text-center">Tiếp cận các phương pháp học tập hiệu quả và kỹ thuật ghi nhớ giúp việc học toán dễ dàng hơn.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4 mx-auto group-hover:bg-indigo-200 transition-colors">
                                    <GraduationCap className="w-7 h-7 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Tư vấn đại học</h3>
                                <p className="text-gray-600 lg:block hidden text-sm text-center">Nhận tư vấn về định hướng nghề nghiệp và chiến lược ôn thi đại học hiệu quả.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🔽 Thành tích Section */}
                <section id="achievements">
                    <AchievementSection />
                </section>

                {/* 🔽 SlideShow Section */}
                <section id="moments" className="w-full px-4 py-10 bg-[#E0F2FE]">
                    <div className="max-w-screen-xl mx-auto flex flex-col gap-6">
                        {/* Title chung */}
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-blue-500 font-cubano tracking-wide drop-shadow-sm flex items-center gap-2 justify-center">
                            <Camera className="w-7 h-7 text-blue-500" />
                            Khoảnh khắc lớp 12
                        </p>
                        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-8">
                            Cùng nhìn lại những kỷ niệm đáng nhớ của các lớp học qua từng năm. Những khoảnh khắc đẹp, những buổi học vui vẻ và những thành tích đáng tự hào của các bạn học sinh.
                        </p>

                        {/* Slideshow cards with student thoughts - alternating layout */}
                        <div className="w-full flex flex-col gap-12">
                            {/* Holiday Special Card */}


                            {/* Row 1: Slideshow left, Thoughts right */}
                            <MomentCard
                                key="2022-2023"
                                year="2022 - 2023"
                                images={momentImages2022}
                                icon={CalendarDays}
                                color="text-pink-500"
                                interval={4000}
                                thoughts={studentThoughts2022}
                                reverse={false}
                            />

                            {/* Row 2: Thoughts left, Slideshow right */}
                            <MomentCard
                                key="2023-2024"
                                year="2023 - 2024"
                                images={momentImages2023}
                                icon={Award}
                                color="text-yellow-500"
                                interval={5000}
                                thoughts={studentThoughts2023}
                                reverse={true}
                            />

                            {/* Row 3: Slideshow left, Thoughts right */}
                            <MomentCard
                                key="2024-2025"
                                year="2024 - 2025"
                                images={momentImages2024}
                                icon={Camera}
                                color="text-sky-600"
                                interval={3000}
                                thoughts={studentThoughts2024}
                                reverse={false}
                            />
                        </div>
                    </div>
                </section>


                <section id="schedule" className="flex justify-center items-center w-full lg:h-[100vh] px-4 py-12 bg-[#FFFDE7]">
                    <div className="max-w-screen-xl mx-auto">
                        <div className="text-center mb-8">
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 font-cubano drop-shadow-sm flex items-center gap-2 justify-center mx-auto">
                                <CalendarClock className="w-6 h-6 text-emerald-600" />
                                Lịch học 2024 - 2025
                            </p>
                            <p className="text-center text-gray-700 max-w-2xl mx-auto mt-2">
                                Thông tin chi tiết về lịch học các lớp trong năm học 2024-2025. Xem lịch học để sắp xếp thời gian học tập hiệu quả và không bỏ lỡ buổi học nào.
                            </p>
                        </div>

                        {/* Responsive grid layout - stacks on mobile, side-by-side on larger screens */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            {/* Slideshow - takes full width on mobile, 2/3 on desktop */}
                            <div className="lg:col-span-2 order-1">
                                <div className="rounded-xl overflow-hidden shadow-lg h-full">
                                    <SlideShow interval={4000} images={calendarImages} h="h-[20rem] lg:h-[30rem]" />
                                </div>
                            </div>

                            {/* Custom Schedule - takes full width on mobile, 1/3 on desktop */}
                            <div className="flex items-center justify-center order-2">
                                <CustomSchedule />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Articles Section */}
                <section id="articles" className="w-full lg:h-[80vh]  px-4 py-12 bg-gradient-to-b from-[#E1F5FE] to-[#E6F7FF]">
                    <div className="max-w-screen-lg mx-auto flex flex-col gap-6">
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 font-cubano text-center w-full flex items-center gap-2 justify-center">
                            <Newspaper className="w-6 h-6 text-blue-600" />
                            Bài viết mới nhất
                        </p>
                        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-4">
                            Những bài viết mới nhất về các phương pháp học tập, kỹ thuật giải toán và kiến thức chuyên sâu. Cập nhật thường xuyên để nâng cao kỹ năng và hiểu quả học tập.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Article Card 1 */}
                            {articles.length > 0 && articles.map((article) => (

                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                                    <div className="p-6">
                                        <h3
                                            onClick={() => navigate(`/article/${article.id}`)}
                                            className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {article.content.length > 100
                                                ? `${article.content.slice(0, 100)}...`
                                                : article.content}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">{formatDate(article.createdAt)}</span>
                                            <button
                                                onClick={() => navigate(`/article/${article.id}`)}
                                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                            >
                                                Đọc tiếp →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => navigate('/articles')}
                                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
                            >
                                <Newspaper size={16} />
                                Xem tất cả bài viết
                            </button>
                        </div>
                    </div>
                </section>

                {/* Newest Exams Section */}
                <section id="exams" className="w-full lg:h-[80vh] px-4 py-12 bg-gradient-to-b from-[#E6F7FF] to-[#F0F4C3] overflow-hidden">
                    <div className="max-w-screen-lg mx-auto flex flex-col gap-6">
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 font-cubano text-center w-full flex items-center gap-2 justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 8V4H8"></path>
                                <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                                <path d="M2 14h2"></path>
                                <path d="M20 14h2"></path>
                                <path d="M15 13v2"></path>
                                <path d="M9 13v2"></path>
                            </svg>
                            Đề thi mới nhất
                        </p>
                        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-4">
                            Những đề thi mới nhất được cập nhật thường xuyên. Luyện tập với các đề thi này để chuẩn bị tốt nhất cho kỳ thi sắp tới.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exams && exams.length > 0 ? (
                                exams.map((exam) => (
                                    <div key={exam.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                        {exam.imageUrl && (
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={exam.imageUrl}
                                                    alt={exam.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6 flex-grow flex flex-col">
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3
                                                        onClick={() => navigate(`/exam/${exam.id}`)}
                                                        className="text-lg font-semibold text-gray-800 hover:text-emerald-600 cursor-pointer truncate"
                                                    >
                                                        {exam.name}
                                                    </h3>
                                                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                                                        {exam.type}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {exam.description || "Luyện tập với đề thi này để nâng cao kỹ năng và kiến thức."}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                                                <span className="text-xs text-gray-500">{formatDate(exam.createdAt)}</span>
                                                <button
                                                    onClick={() => navigate(`practice/exam/${exam.id}`)}
                                                    className="text-emerald-500 hover:text-emerald-700 text-sm font-medium"
                                                >
                                                    Làm bài →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-8">
                                    <p className="text-gray-500">Chưa có đề thi nào.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => navigate('/exams')}
                                className="px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors duration-300 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 8V4H8"></path>
                                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                                    <path d="M2 14h2"></path>
                                    <path d="M20 14h2"></path>
                                    <path d="M15 13v2"></path>
                                    <path d="M9 13v2"></path>
                                </svg>
                                Xem tất cả đề thi
                            </button>
                        </div>
                    </div>
                </section>
                <div className="fixed bottom-4 right-0 z-10 flex flex-col gap-2">
                    <ContactButton />

                    <CountDownCard
                        targetTime={new Date("2025-06-26T23:59:59")}
                        title="Kì thi THPT quốc gia"
                    />
                </div>

            </div>

            <div className="flex justify-center bg-[#F6FAFD] w-full items-center">
                <Footer />
            </div>
        </UserLayoutHome>
    );
};

export default Home;
const zaloIconUrl = "https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg";
const facebookIconUrl = "https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg"

const ContactButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Function to toggle the menu open/closed
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Function to handle clicks outside the menu to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add event listener when the menu is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="flex flex-col justify-center items-end mr-1" ref={menuRef}>
            <div
                onClick={toggleMenu}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center shadow-xl cursor-pointer animate-pulse"
            >
                <Headphones className="w-6 h-6 text-white" />

                {isOpen && (
                    <div className="absolute bottom-[11rem] flex flex-col gap-2 items-end">

                        <a
                            href="https://m.me/9349151345145048"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:scale-110 transition-transform"
                        >
                            <img src={MessageIcon} alt="Messenger" className="w-10 object-contain" />
                        </a>
                        <a
                            href="https://zalo.me/0333726202"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:scale-110 transition-transform"
                        >
                            <img src={zaloIconUrl} alt="Zalo" className="w-10 object-contain" />
                        </a>
                        <a
                            href="https://facebook.com/loptoanthaybee"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:scale-110 transition-transform"
                        >
                            <img src={facebookIconUrl} alt="Facebook" className="w-10 object-contain" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};
