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
        <div className="w-44 sm:w-48 p-2 sm:p-3 gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-br from-purple-500 to-pink-400 text-white rounded-2xl shadow-lg flex flex-col items-center transition-all">
            <p className="text-center font-semibold font-['Be_Vietnam_Pro']">
                {title}
            </p>

            {timeLeft ? (
                <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full text-center">
                    <TimeBox label="Ngày" value={timeLeft.days} />
                    <TimeBox label="Giờ" value={timeLeft.hours} />
                    <TimeBox label="Phút" value={timeLeft.minutes} />
                    <TimeBox label="Giây" value={timeLeft.seconds} />
                </div>
            ) : (
                <div className="text-red-100 font-medium">Hết giờ!</div>
            )}
        </div>
    );
};

const TimeBox = ({ label, value }) => (
    <div className="flex flex-col items-center bg-white/80 text-purple-700 rounded-lg py-1 px-1.5 sm:px-2 shadow-inner">
        <span className="text-sm font-bold font-mono leading-tight">
            {String(value).padStart(2, "0")}
        </span>
        <span className="text-[10px] font-medium">{label}</span>
    </div>
);

export default CountDownCard;
