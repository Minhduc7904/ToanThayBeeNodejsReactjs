import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearSuccessMessage, clearErrorsMessage } from "../../features/state/stateApiSlice";

const NotificationDisplay = ({ customClassName = "" }) => {
    const successMessage = useSelector((state) => state.states.successMessage);
    const errorsMessage = useSelector((state) => state.states.errorsMessage);
    const dispatch = useDispatch();
    const [visibleMessages, setVisibleMessages] = useState([]);

    useEffect(() => {
        const addMessage = (message, type) => {
            const newMessage = {
                id: Date.now(),
                message,
                type,
                fadeOut: false
            };

            setVisibleMessages((prev) => [...prev, newMessage]);

            // Tự động biến mất sau 2.5 giây
            setTimeout(() => {
                setVisibleMessages((prev) =>
                    prev.map((msg) => (msg.id === newMessage.id ? { ...msg, fadeOut: true } : msg))
                );
            }, 2500);

            // Xóa message khỏi danh sách sau 3 giây
            setTimeout(() => {
                setVisibleMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));

                if (type === "success") dispatch(clearSuccessMessage());
                if (type === "error") dispatch(clearErrorsMessage());
            }, 3000);
        };

        if (successMessage) addMessage(successMessage, "success");
        if (errorsMessage) addMessage(errorsMessage, "error");

    }, [successMessage, errorsMessage, dispatch]);

    if (visibleMessages.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 w-[20rem] flex flex-col gap-2 z-50">
            {visibleMessages.map((msg, index) => (
                <div
                    key={msg.id}
                    className={`px-4 py-3 rounded-md shadow-md flex items-center justify-between transition-all duration-500 ease-in-out
                        ${msg.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
                        ${msg.fadeOut ? "opacity-0 translate-y-[-20px]" : "opacity-100 translate-y-0"}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                >
                    <span>{msg.message}</span>
                    <button
                        onClick={() => setVisibleMessages((prev) => prev.filter((m) => m.id !== msg.id))}
                        className="ml-4 font-bold hover:opacity-75 transition"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationDisplay;
