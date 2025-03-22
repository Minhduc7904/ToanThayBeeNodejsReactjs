// components/common/Pagination.jsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({ currentPage, totalItems, limit, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / limit);

    const getPages = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }

        return pages;
    };

    const pagesToRender = getPages();

    const handleClick = (page) => {
        if (page === "..." || page === currentPage) return;
        onPageChange(page);
    };

    return (
        <div className="flex justify-center items-center gap-1 mt-6 flex-wrap text-sm font-medium">
            <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
            >
                <ChevronsLeft size={16} />
            </button>
            <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft size={16} />
            </button>

            {pagesToRender.map((page, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(page)}
                    className={`px-3 py-1 rounded-md border 
                        ${page === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"}
                        ${page === "..." ? "cursor-default" : ""}
                    `}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            ))}

            <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight size={16} />
            </button>
            <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
            >
                <ChevronsRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;
