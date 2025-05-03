import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const ChapterFilters = ({
    isChapterCodeClass,
    codes,
    articles,
    selectedClass,
    selectedType,
    selectedChapter,
    searchTerm,
    setSelectedChapter,
    setCurrentPage,
    setShowMobileSidebar
}) => {
    const navigate = useNavigate();
    
    if (!selectedClass) return null;
    
    return (
        <div className="bg-white border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium text-gray-700 flex items-center">
                    <BookOpen size={16} className="mr-2" />
                    Chương
                </h3>
            </div>
            <div className="divide-y">
                {codes["chapter"].filter(chapter => chapter.code.startsWith(selectedClass)).map(chapter => (
                    <div
                        key={chapter.code}
                        className={`px-4 py-2 cursor-pointer ${selectedChapter === chapter.code ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        onClick={() => {
                            // Calculate the new chapter value
                            const newChapterValue = chapter.code === selectedChapter ? "" : chapter.code;

                            // Update the state
                            setSelectedChapter(newChapterValue);
                            // Reset to page 1 when changing filters
                            setCurrentPage(1);

                            // Create URL params with the new value (not waiting for state update)
                            const params = new URLSearchParams();
                            if (searchTerm) params.append("search", searchTerm);
                            if (selectedType) params.append("type", selectedType);
                            if (selectedClass) params.append("class", selectedClass);
                            if (newChapterValue) params.append("chapter", newChapterValue);
                            // Don't include page param since we're resetting to page 1

                            // Navigate directly
                            navigate(`/articles?${params.toString()}`);

                            // Close mobile sidebar on mobile

                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`${selectedChapter === chapter.code ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                {chapter.description}
                            </span>
                            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {articles.filter(a => a.chapter === chapter.code && a.class === selectedClass).length}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChapterFilters;
