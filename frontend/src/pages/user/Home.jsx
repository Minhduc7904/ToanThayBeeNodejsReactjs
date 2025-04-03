import UserLayout from "../../layouts/UserLayout";
import TeacherImage from "../../assets/images/teacherImage.jpg";
import CountDownCard from "../../components/card/countDownCard";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import SlideShow from "../../components/image/SlideShow";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { checkLogin } from '../../features/auth/authSlice';

import banner1 from "../../assets/images/448442239_2773856989430721_8578743624183224087_n.jpg";
import banner2 from "../../assets/images/448712528_2777775295705557_6902967523121265908_n.jpg";
import banner3 from "../../assets/images/448765305_2776991819117238_2057468535959693814_n.jpg";
import banner4 from "../../assets/images/448843372_2776845152465238_5807408113166692154_n.jpg";
import tongon from "../../assets/images/tongon.jpg";
import luyende from "../../assets/images/luyende.jpg";

import calender12 from "../../assets/images/calender12.jpg";
import calender11 from "../../assets/images/calender11.jpg";
import calender10 from "../../assets/images/calender10.jpg";
import calender9 from "../../assets/images/calender9.jpg";

import score from "../../assets/images/452910953_2801906823292404_7050377248106033666_n.jpg";
import score1 from "../../assets/images/452862810_2801906743292412_8734534488639223163_n.jpg";
import score2 from "../../assets/images/452862810_2801906743292412_8734534488639223163_n.jpg";
import score3 from "../../assets/images/452851829_2801906649959088_2323067618654372761_n.jpg";
import score4 from "../../assets/images/452688041_2801906689959084_3038608462727945306_n.jpg";

import score20251 from "../../assets/images/score20251.jpg";
import score20252 from "../../assets/images/score20252.jpg";
import score20253 from "../../assets/images/score20253.jpg";
import score20254 from "../../assets/images/score20254.jpg";


const calenderSlides = [luyende, tongon, calender12, calender11, calender10, calender9];
const slideImages = [banner1, banner2, banner3, banner4];
const scoreSlides = [score, score1, score2, score3, score4];
const score2025Slides = [score20251, score20252, score20253, score20254];

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            dispatch(checkLogin());
        }
    }, [user, dispatch]);

    return (
        <UserLayout>
            <div className="relative ">

                <section className="bg-gradient-to-b lg:h-[100vh] from-white to-[#F6FAFD]">
                    <div className="flex flex-col-reverse lg:h-[45rem] lg:flex-row justify-center items-center gap-12 lg:gap-18 px-6 pb-10">
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2 }}
                            className="w-full lg:w-1/2 flex justify-center items-center lg:justify-end lg:items-end gap-6"
                        >
                            <div className="flex flex-col justify-center gap-4">
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
                                <ul className="list-disc pl-6 text-base lg:text-lg text-slate-700 font-['Be_Vietnam_Pro'] space-y-2">
                                    <li>
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

                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.3 }}
                            className="w-full lg:w-1/2 flex h-full lg:justify-start justify-center"
                        >
                            <img
                                src={TeacherImage}
                                alt="teacher"
                                className="object-cover max-w-full h-full rounded-xl shadow-md"
                            />
                        </motion.div>
                    </div>
                </section>
                {/* 🔽 Lịch học Section */}


                {/* 🔽 SlideShow Section */}
                <section className="flex lg:h-[80vh] w-full justify-center items-center px-4 py-10 bg-[#E0F2FE]">
                    <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-6 overflow-hidden">
                        {/* Slideshow 1 */}
                        <div className="flex-1 flex flex-col items-center">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-center text-pink-500 font-cubano tracking-wide mb-3 drop-shadow-sm">
                                Khoảnh khắc lớp 12 – 2022-2023
                            </h2>
                            <div className="w-full rounded-xl overflow-hidden shadow-lg">
                                <SlideShow interval={4000} images={slideImages} h="h-[15rem] lg:h-[18rem]" />
                            </div>
                        </div>

                        {/* Slideshow 2 */}
                        <div className="flex-1 flex flex-col items-center">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-center text-yellow-500 font-cubano tracking-wide mb-3 drop-shadow-sm">
                                Khoảnh khắc lớp 12 – 2023-2024
                            </h2>
                            <div className="w-full rounded-xl overflow-hidden shadow-lg">
                                <SlideShow interval={5000} images={slideImages} h="h-[15rem] lg:h-[18rem]" />
                            </div>
                        </div>

                        {/* Slideshow 3 */}
                        <div className="flex-1 flex flex-col items-center">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-center text-sky-600 font-cubano tracking-wide mb-3 drop-shadow-sm">
                                Khoảnh khắc lớp 12 – 2024-2025
                            </h2>
                            <div className="w-full rounded-xl overflow-hidden shadow-lg">
                                <SlideShow interval={3000} images={slideImages} h="h-[15rem] lg:h-[18rem]" />
                            </div>
                        </div>

                        {/* 🔽 Lịch học */}

                    </div>

                </section>

                <section className="w-full px-4 py-12 bg-[#FFFDE7]">
                    <div className="max-w-screen-md mx-auto flex flex-col items-center gap-6">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-emerald-600 font-cubano drop-shadow-sm">
                            📅 Lịch học 2024 - 2025
                        </h2>
                        <div className="w-full rounded-xl overflow-hidden shadow-lg">
                            <SlideShow interval={4000} images={calenderSlides} h="h-[15rem] lg:h-[25rem]" />
                        </div>
                    </div>
                </section>

                <section className="flex justify-center items-center w-full lg:h-[100vh] px-4 py-12 bg-gradient-to-b from-[#F0F4C3] to-white">
                    <div className="max-w-screen-lg justify-center items-center h-full mx-auto flex flex-col gap-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-cubano text-center w-full">
                            🏆 Thành tích & Báo chí
                        </h2>

                        <div className="flex w-full h-full gap-6 flex-col lg:flex-row">
                            <div className=" flex-1 h-full rounded-xl overflow-hidden shadow-lg">
                                <SlideShow images={scoreSlides} h="h-full" interval={3000} />
                            </div>
                            <div className="flex-1  h-full rounded-xl overflow-hidden shadow-lg">
                                <SlideShow images={score2025Slides} h="h-full" interval={3000} />
                            </div>
                        </div>


                        {/* 🔽 Link bài báo */}
                        <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 w-full">
                            <p className="text-base font-medium text-slate-700 mb-2">📢 Báo chí nói gì?</p>
                            <a
                                href="https://vnexpress.net/nu-sinh-dat-27-diem-khoi-d-chia-se-bi-quyet-luyen-thi-4284953.html?fbclid=IwY2xjawJRvANleHRuA2FlbQIxMAABHbNEj77ce0E1HFK1b6JHKcxSe5XoLgTVFhuSPzaARSjPZXCYKhdVKATZ1A_aem_OTP13uEFNFiHI_OHfAUTHQ"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:underline"
                            >
                                📄 Nữ sinh đạt 27 điểm khối D chia sẻ bí quyết luyện thi – VnExpress
                            </a>
                        </div>
                    </div>
                </section>

                <div className="fixed bottom-4 right-0 z-50">
                    <CountDownCard
                        targetTime={new Date("2025-06-26T23:59:59")}
                        title="Kì thi THPT quốc gia"
                    />
                </div>

            </div>

            <div className="flex justify-center bg-[#F6FAFD] w-full items-center">
                <Footer />
            </div>
        </UserLayout>
    );
};

export default Home;
