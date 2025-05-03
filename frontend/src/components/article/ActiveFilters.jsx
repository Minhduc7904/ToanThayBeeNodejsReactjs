import React from 'react';
import { Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActiveFilters = ({
    selectedType,
    selectedClass,
    selectedChapter,
    searchTerm,
    isChapterCodeClass,
    getTypeDescription,
    getClassDescription,
    getChapterDescription,
    setSelectedType,
    setSelectedClass,
    setSelectedChapter,
    setCurrentPage,
    handleResetFilters
}) => {
    const navigate = useNavigate();
    
    const hasActiveFilters = selectedType || selectedClass || (selectedClass && selectedChapter);
    
    if (!hasActiveFilters) return null;
    
    return (
        <div className="bg-white border rounded-md p-4 mb-4">
            <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <Filter size={16} className="mr-2" />
                Bộ lọc đang áp dụng
            </h3>
            <div className="flex flex-wrap gap-2">
                {selectedType && (
                    <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                        <span>{getTypeDescription(selectedType)}</span>
                        <button
                            onClick={() => {
                                // Update state
                                setSelectedType("");
                                setCurrentPage(1);

                                // Create URL params with updated values
                                const params = new URLSearchParams();
                                if (searchTerm) params.append("search", searchTerm);
                                // Don't include type since we're removing it
                                if (selectedClass) params.append("class", selectedClass);
                                if (selectedClass && selectedChapter) params.append("chapter", selectedChapter);

                                // Navigate directly
                                navigate(`/articles?${params.toString()}`);
                            }}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                {selectedClass && (
                    <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                        <span>{getClassDescription(selectedClass)}</span>
                        <button
                            onClick={() => {
                                // Update state
                                setSelectedClass("");
                                setCurrentPage(1);

                                // Create URL params with updated values
                                const params = new URLSearchParams();
                                if (searchTerm) params.append("search", searchTerm);
                                if (selectedType) params.append("type", selectedType);
                                // Don't include class since we're removing it

                                // Navigate directly
                                navigate(`/articles?${params.toString()}`);
                            }}
                            className="ml-1 text-green-500 hover:text-green-700"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                {selectedClass && selectedChapter && (
                    <div className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
                        <span>{selectedChapter}</span>
                        <button
                            onClick={() => {
                                // Update state
                                setSelectedChapter("");
                                setCurrentPage(1);

                                // Create URL params with updated values
                                const params = new URLSearchParams();
                                if (searchTerm) params.append("search", searchTerm);
                                if (selectedType) params.append("type", selectedType);
                                if (selectedClass) params.append("class", selectedClass);
                                // Don't include chapter since we're removing it

                                // Navigate directly
                                navigate(`/articles?${params.toString()}`);
                            }}
                            className="ml-1 text-purple-500 hover:text-purple-700"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                {hasActiveFilters && (
                    <button
                        onClick={handleResetFilters}
                        className="text-xs text-gray-500 hover:text-gray-700 underline mt-2 w-full text-left"
                    >
                        Xóa tất cả bộ lọc
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActiveFilters;
