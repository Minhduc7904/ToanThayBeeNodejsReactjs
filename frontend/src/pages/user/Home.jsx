import UserLayout from "../../layouts/UserLayout";
import TeacherImage from "../../assets/images/teacherImage.jpg"
import CountDownCard from "../../components/card/countDownCard";
import Footer from "../../components/Footer"

const Home = () => {
    return (
        <UserLayout>
            <div className="h-screen overflow-y-auto snap-y">
                {/* Mỗi màn hình con */}
                <div className=" flex justify-center items-center bg-[#F6FAFD] gap-36 bg-no-repeat bg-cover bg-center" >
                    <div className="self-stretch inline-flex flex-col justify-center items-start gap-11">
                        <div className="justify-start">
                            <span class="text-zinc-800 text-6xl font-normal font-cubano">Học </span>
                            <span class="text-blue-400 text-6xl font-normal font-cubano">thầy Bee<br /></span>
                            <span class="text-zinc-800 text-6xl font-normal font-cubano">Toán easy</span>
                        </div>
                        <div data-property-1="Button 1" className="rounded-[124px] flex flex-col justify-center items-start gap-2.5">
                            <div className="px-14 py-4 bg-gradient-to-r from-teal-400 to-sky-300 rounded-[100px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2.5">
                                <div className="justify-start text-white text-4xl font-black font-['Be_Vietnam_Pro']">Vào học ngay</div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch ">
                        <img
                            src={TeacherImage}
                            alt="teacher"
                            className="object-cover h-full justify-center items-center"
                        />
                    </div>
                </div>
                <div className="h-[80vh] flex flex-col justify-center bg-[#F6FAFD]  items-center gap-20">
                    <div className="self-stretch text-center justify-start text-slate-700 text-4xl font-black font-['Montserrat']">ĐẾM NGƯỢC NGÀY THI</div>
                    <div className="self-stretch inline-flex flex-row justify-center items-center gap-12">
                        <CountDownCard targetTime={new Date("2025-12-31T23:59:59")} title={"Kì thi THPT quốc gia"} />
                        <CountDownCard targetTime={new Date("2025-12-31T23:59:59")} title={"Kì thi THPT quốc gia"} />
                        <CountDownCard targetTime={new Date("2025-12-31T23:59:59")} title={"Kì thi THPT quốc gia"} />
                        <CountDownCard targetTime={new Date("2025-12-31T23:59:59")} title={"Kì thi THPT quốc gia"} />
                    </div>
                </div>
                <div className=" flex justify-center bg-[#F6FAFD] w-full items-center">
                    <Footer />
                </div>
            </div>
        </UserLayout>
    )
}

export default Home;
