import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearSuccessMessage, clearErrorsMessage } from "../../features/state/stateApiSlice";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const NotificationDisplay = ({ customClassName = "" }) => {
    const successMessage = useSelector((state) => state.states.successMessage);
    const errorsMessage = useSelector((state) => state.states.errorsMessage);
    const dispatch = useDispatch();
    const [visibleMessages, setVisibleMessages] = useState([]);
    const [headerHeight, setHeaderHeight] = useState(0);
    const notificationRef = useRef(null);

    // Tính toán chiều cao của header để đặt vị trí thông báo
    useEffect(() => {
        const header = document.querySelector('header');
        if (header) {
            setHeaderHeight(header.offsetHeight + 16); // header height + 16px padding

            const handleResize = () => {
                setHeaderHeight(header.offsetHeight + 16);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        const addMessage = (message, type) => {
            // Generate a unique ID by combining timestamp with a random number and type prefix
            const uniqueId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const newMessage = {
                id: uniqueId,
                message,
                type,
                fadeOut: false
            };

            setVisibleMessages((prev) => [...prev, newMessage]);

            setTimeout(() => {
                setVisibleMessages((prev) =>
                    prev.map((msg) => (msg.id === uniqueId ? { ...msg, fadeOut: true } : msg))
                );
            }, 2500);

            setTimeout(() => {
                setVisibleMessages((prev) => prev.filter((msg) => msg.id !== uniqueId));
                if (type === "success") dispatch(clearSuccessMessage());
                if (type === "error") dispatch(clearErrorsMessage());
            }, 3000);
        };

        if (successMessage) addMessage(successMessage, "success");
        if (errorsMessage) addMessage(errorsMessage, "error");
    }, [successMessage, errorsMessage, dispatch]);

    if (visibleMessages.length === 0) return null;

    return (
        <div
            ref={notificationRef}
            style={{ top: `${headerHeight}px` }}
            className={`fixed right-6 mt-6 w-full max-w-sm flex flex-col gap-3 z-50 ${customClassName}`}>
            {visibleMessages.map((msg, index) => (
                <div
                    key={msg.id}
                    className={`w-full h-full px-4 py-3 rounded-2xl shadow-lg flex items-start justify-between gap-3 border-l-4
                        ${msg.type === "success"
                            ? "bg-green-50 border-green-500 text-green-800"
                            : "bg-red-50 border-red-500 text-red-800"}
                        transition-all duration-500 ease-in-out
                        ${msg.fadeOut ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                >
                    <div className="flex items-center justify-center h-full gap-2">
                        {msg.type === "success" ? (
                            <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
                        ) : (
                            <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
                        )}
                        <span className="text-sm font-medium leading-snug">{msg.message}</span>
                    </div>
                    <button
                        onClick={() => setVisibleMessages((prev) => prev.filter((m) => m.id !== msg.id))}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationDisplay;
