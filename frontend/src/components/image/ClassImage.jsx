const gradients = [
    ["from-blue-400", "to-cyan-400"],
    ["from-pink-400", "to-red-400"],
    ["from-green-400", "to-lime-400"],
    ["from-purple-400", "to-indigo-400"],
    ["from-yellow-400", "to-orange-400"],
    ["from-emerald-400", "to-teal-400"],
];

const getRandomGradient = () => {
    const random = Math.floor(Math.random() * gradients.length);
    return gradients[random];
};

const ClassImage = ({ name, className = "" }) => {
    const [fromColor, toColor] = getRandomGradient();

    return (
        <div
            className={`px-6 py-3 bg-gradient-to-l ${fromColor} ${toColor} rounded-md flex items-center justify-center ${className}`}
        >
            <div className="text-white text-xl font-normal font-cubano text-center [text-shadow:_2px_2px_4px_rgb(20_108_148_/_1.00)]">
                {name}
            </div>
        </div>
    );
};

export default ClassImage;
