import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearSuccessMessage } from "../../features/state/stateApiSlice";

const SuccessDisplay = ({ customClassName = "" }) => {
    const successMessage = useSelector((state) => state.states.successMessage);
    const dispatch = useDispatch();
    const [visibleMessages, setVisibleMessages] = useState([]);

    useEffect(() => {
        if (successMessage) {
            const newMessage = {
                id: Date.now(),
                message: successMessage,
                fadeOut: false
            };

            // Thêm message vào danh sách hiển thị
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
                dispatch(clearSuccessMessage()); // Xóa thông báo sau khi tất cả đã biến mất
            }, 3000);
        }
    }, [successMessage, dispatch]);

    if (visibleMessages.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 w-[20rem] flex flex-col gap-2 z-50">
            {visibleMessages.map((msg, index) => (
                <div
                    key={msg.id}
                    className={`bg-green-100 text-green-600 px-4 py-3 rounded-md shadow-md flex items-center justify-between transition-all duration-500 ease-in-out
                        ${msg.fadeOut ? "opacity-0 translate-y-[-20px]" : "opacity-100 translate-y-0"}`}
                    style={{ transitionDelay: `${index * 100}ms` }} // Hiệu ứng biến mất lần lượt
                >
                    <span>{msg.message}</span>
                    <button
                        onClick={() =>
                            setVisibleMessages((prev) => prev.filter((m) => m.id !== msg.id))
                        }
                        className="ml-4 text-green-800 font-bold hover:text-green-900 transition"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SuccessDisplay;
