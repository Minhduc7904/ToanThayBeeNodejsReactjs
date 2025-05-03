import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const CategoryFilters = ({
    codes,
    articles,
    selectedType,
    selectedClass,
    searchTerm,
    setSelectedType,
    setCurrentPage,
    setShowMobileSidebar
}) => {
    const navigate = useNavigate();

    if (!codes || !codes["article type"]) return null;

    return (
        <div className="bg-white border rounded-md overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium text-gray-700 flex items-center">
                    <BookOpen size={16} className="mr-2" />
                    Danh mục
                </h3>
            </div>
            <div className="divide-y">
                {codes["article type"].map(type => (
                    <div
                        key={type.code}
                        className={`px-4 py-2 cursor-pointer ${selectedType === type.code ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        onClick={() => {
                            // Calculate the new type value
                            const newTypeValue = type.code === selectedType ? "" : type.code;

                            // Update the state
                            setSelectedType(newTypeValue);
                            // Reset to page 1 when changing filters
                            setCurrentPage(1);

                            // Create URL params with the new value (not waiting for state update)
                            const params = new URLSearchParams();
                            if (searchTerm) params.append("search", searchTerm);
                            if (newTypeValue) params.append("type", newTypeValue);
                            if (selectedClass) params.append("class", selectedClass);
                            // Don't include page param since we're resetting to page 1

                            // Navigate directly
                            navigate(`/articles?${params.toString()}`);

                            // Close mobile sidebar on mobile

                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`${selectedType === type.code ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                {type.description}
                            </span>
                            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {articles.filter(a => a.type === type.code).length}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilters;
