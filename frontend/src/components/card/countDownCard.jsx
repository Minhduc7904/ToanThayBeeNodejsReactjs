import { useState, useEffect } from "react";

const CountDownCard = ({ targetTime, title }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = targetTime - new Date().getTime();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            return null;
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTime]);

    return (
        <div className="w-60 h-60 p-6 bg-white rounded-3xl shadow-[0px_0px_56px_8px_rgba(255,255,255,1.00)] outline outline-2 outline-cyan-700 flex flex-col items-center gap-12">
            <h2 className="text-slate-700 text-2xl font-black font-['Be_Vietnam_Pro'] [text-shadow:_0px_0px_4px_rgb(153_180_249_/_1.00)] text-center mb-2">{title}</h2>
            {timeLeft ? (
                <div className="flex space-x-3 text-slate-500 text-xl font-normal font-['Be_Vietnam_Pro']">
                    <div className="flex flex-col items-center text-center">
                        <p>Ngày</p>
                        <span>{String(timeLeft.days).padStart(2, "0")}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <p>Giờ</p>
                        <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <p>Phút</p>
                        <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <p>Giây</p>
                        <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                    </div>
                </div>
            ) : (
                <div className="text-red-500 font-bold text-lg">Hết giờ!</div>
            )}
        </div>
    );
};

export default CountDownCard;
