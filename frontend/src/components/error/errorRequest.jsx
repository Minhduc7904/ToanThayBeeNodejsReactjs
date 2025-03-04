import { useEffect, useState } from 'react';

export const ErrorRequest = ({ formErrors, clearErrors }) => {
    const [fadeOut, setFadeOut] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (formErrors.length > 0) {
            setFadeOut(false);
            setProgress(100); 

            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.max(prev - 5, 0)); 
            }, 125);

            const fadeTimer = setTimeout(() => {
                setFadeOut(true);
            }, 2500); 

            const removeTimer = setTimeout(() => {
                clearErrors();
            }, 3000);

            return () => {
                clearInterval(progressInterval);
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [formErrors, clearErrors]);

    return (
        <div className={`absolute right-6 top-6 bg-red-100 text-red-600 p-4 rounded-md transition-opacity duration-500 ease-in-out ${fadeOut ? "opacity-0" : "opacity-100"}`}>
            <ul className="list-disc list-inside">
                {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
            <div className="h-1 bg-gray-300 mt-2 rounded-md overflow-hidden">
                <div
                    className={`h-full transition-all duration-150 ease-linear ${progress > 50 ? "bg-green-500" : progress > 20 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

        </div>
    )
}