import { useEffect, useState } from "react";
import HeaderHome from "../components/header/HeaderHome";

const UserLayoutHome = ({ children }) => {
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        // Get the header height after it's rendered
        const header = document.querySelector('header');
        if (header) {
            setHeaderHeight(header.offsetHeight);

            // Update header height on window resize
            const handleResize = () => {
                setHeaderHeight(header.offsetHeight);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <div className="flex flex-col overflow-hidden">
            <HeaderHome />
            <div style={{ paddingTop: `${headerHeight}px` }}>
                {children}
            </div>
        </div>
    );
}


export default UserLayoutHome;