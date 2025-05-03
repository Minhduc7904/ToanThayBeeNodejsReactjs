import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    showPageNumbers = true,
    maxPageButtons = 5,
    className = ''
}) => {
    // Calculate the range of page numbers to display
    const getPageRange = () => {
        if (totalPages <= maxPageButtons) {
            // If total pages is less than max buttons, show all pages
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Calculate the start and end of the page range
        let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let end = start + maxPageButtons - 1;

        // Adjust if end exceeds totalPages
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxPageButtons + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    // Don't render if there's only one page
    if (totalPages <= 1) {
        return null;
    }

    const pageRange = getPageRange();

    return (
        <div className={`flex items-center justify-center space-x-1 ${className}`}>
            {/* Previous button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-9 h-9 rounded-md ${
                    currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Previous page"
            >
                <ChevronLeft size={18} />
            </button>

            {/* Page numbers */}
            {showPageNumbers && (
                <>
                    {/* Show first page and ellipsis if needed */}
                    {pageRange[0] > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className={`flex items-center justify-center w-9 h-9 rounded-md text-gray-700 hover:bg-gray-100`}
                            >
                                1
                            </button>
                            {pageRange[0] > 2 && (
                                <span className="flex items-center justify-center w-9 h-9 text-gray-500">
                                    ...
                                </span>
                            )}
                        </>
                    )}

                    {/* Page numbers */}
                    {pageRange.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`flex items-center justify-center w-9 h-9 rounded-md ${
                                currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Show last page and ellipsis if needed */}
                    {pageRange[pageRange.length - 1] < totalPages && (
                        <>
                            {pageRange[pageRange.length - 1] < totalPages - 1 && (
                                <span className="flex items-center justify-center w-9 h-9 text-gray-500">
                                    ...
                                </span>
                            )}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className={`flex items-center justify-center w-9 h-9 rounded-md text-gray-700 hover:bg-gray-100`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </>
            )}

            {/* Next button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-9 h-9 rounded-md ${
                    currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Next page"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default Pagination;
