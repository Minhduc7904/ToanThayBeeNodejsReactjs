import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "../../features/state/stateApiSlice";

const ErrorsDisplay = ({ customClassName = "" }) => {
    const errors = useSelector((state) => state.states.errors);
    const dispatch = useDispatch();
    const [visibleErrors, setVisibleErrors] = useState([]);

    useEffect(() => {
        if (errors.length > 0) {
            errors.forEach((error, i) => {
                const newError = {
                    id: Date.now() + i,
                    message: typeof error === "object" && error !== null ? error.message || JSON.stringify(error) : error,
                    fadeOut: false
                };

                // Thêm lỗi vào danh sách hiển thị với delay dựa trên index
                setTimeout(() => {
                    setVisibleErrors((prev) => [...prev, newError]);
                }, i * 100); // Mỗi lỗi xuất hiện cách nhau 500ms

                // Tự động biến mất sau khi xuất hiện 2.5 giây
                setTimeout(() => {
                    setVisibleErrors((prev) =>
                        prev.map((e) => (e.id === newError.id ? { ...e, fadeOut: true } : e))
                    );
                }, (i * 100) + 2500);

                // Xóa lỗi khỏi danh sách sau 3 giây
                setTimeout(() => {
                    setVisibleErrors((prev) => prev.filter((e) => e.id !== newError.id));
                    if (i === errors.length - 1) {
                        dispatch(clearErrors()); // Xóa toàn bộ lỗi sau khi tất cả đã biến mất
                    }
                }, (i * 100) + 3000);
            });
        }
    }, [errors, dispatch]);

    if (visibleErrors.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 w-[20rem] flex flex-col gap-2 z-50">
            {visibleErrors.map((error, index) => (
                <div
                    key={error.id}
                    className={`bg-red-100 text-red-600 px-4 py-3 rounded-md shadow-md flex items-center justify-between transition-all duration-500 ease-in-out
                        ${error.fadeOut ? "opacity-0 translate-y-[-20px]" : "opacity-100 translate-y-0"}
                    `}
                    style={{ transitionDelay: `${index * 100}ms` }} // Hiệu ứng biến mất lần lượt
                >
                    <span>{error.message}</span>
                    <button
                        onClick={() =>
                            setVisibleErrors((prev) => prev.filter((e) => e.id !== error.id))
                        }
                        className="ml-4 text-red-800 font-bold hover:text-red-900 transition"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ErrorsDisplay;
