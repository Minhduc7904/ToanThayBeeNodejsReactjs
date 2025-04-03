const LearningItemIcon = ({ type, size = "w-5 h-5 " }) => {
    switch (type) {
        case "BTVN":
            return (
                <svg className={`${size} text-blue-500`} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 20C4 19.337 4.26339 18.7011 4.73223 18.2322C5.20107 17.7634 5.83696 17.5 6.5 17.5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.5 2.5H20V22.5H6.5C5.83696 22.5 5.20107 22.2366 4.73223 21.7678C4.26339 21.2989 4 20.663 4 20V5C4 4.33696 4.26339 3.70107 4.73223 3.23223C5.20107 2.76339 5.83696 2.5 6.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "VID":
            return (
                <svg className={`${size} text-red-500`} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.54 6.92C22.42 6.45 22.18 6.01 21.84 5.66C21.5 5.31 21.07 5.05 20.6 4.92C18.88 4.5 12 4.5 12 4.5C12 4.5 5.12 4.5 3.4 4.96C2.93 5.09 2.5 5.35 2.16 5.7C1.82 6.05 1.58 6.49 1.46 6.96C1.15 8.71 0.99 10.48 1 12.25C0.99 14.04 1.14 15.82 1.46 17.58C1.59 18.04 1.84 18.46 2.18 18.79C2.52 19.13 2.94 19.37 3.4 19.5C5.12 19.96 12 19.96 12 19.96C12 19.96 18.88 19.96 20.6 19.5C21.07 19.37 21.5 19.11 21.84 18.76C22.18 18.41 22.42 17.97 22.54 17.5C22.85 15.77 23.01 14.01 23 12.25C23.01 10.46 22.86 8.68 22.54 6.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.75 15.52L15.5 12.25L9.75 8.98V15.52Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "DOC":
            return (
                <svg className={`${size} text-green-500`} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2.5H6C5.47 2.5 4.96 2.71 4.59 3.09C4.21 3.46 4 3.97 4 4.5V20.5C4 21.03 4.21 21.54 4.59 21.91C4.96 22.29 5.47 22.5 6 22.5H18C18.53 22.5 19.04 22.29 19.41 21.91C19.79 21.54 20 21.03 20 20.5V8.5L14 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2.5V8.5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 13.5H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 17.5H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 9.5H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        default:
            return null;
    }
};

export default LearningItemIcon;