import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const ClassFilters = ({
    codes,
    articles,
    selectedClass,
    selectedType,
    searchTerm,
    setSelectedClass,
    setCurrentPage,
    setShowMobileSidebar
}) => {
    const navigate = useNavigate();
    
    if (!codes || !codes["grade"]) return null;
    
    return (
        <div className="bg-white border rounded-md overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium text-gray-700 flex items-center">
                    <GraduationCap size={16} className="mr-2" />
                    Lớp
                </h3>
            </div>
            <div className="divide-y">
                {codes["grade"].map(grade => (
                    <div
                        key={grade.code}
                        className={`px-4 py-2 cursor-pointer ${selectedClass === grade.code ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        onClick={() => {
                            // Calculate the new class value
                            const newClassValue = grade.code === selectedClass ? "" : grade.code;

                            // Update the state
                            setSelectedClass(newClassValue);
                            // Reset to page 1 when changing filters
                            setCurrentPage(1);

                            // Create URL params with the new value (not waiting for state update)
                            const params = new URLSearchParams();
                            if (searchTerm) params.append("search", searchTerm);
                            if (selectedType) params.append("type", selectedType);
                            if (newClassValue) params.append("class", newClassValue);
                            // Don't include page param since we're resetting to page 1

                            // Navigate directly
                            navigate(`/articles?${params.toString()}`);

                            // Close mobile sidebar on mobile

                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`${selectedClass === grade.code ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                {grade.description}
                            </span>
                            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {articles.filter(a => a.class === grade.code).length}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassFilters;
