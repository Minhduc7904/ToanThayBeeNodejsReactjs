import React from 'react';
import ActiveFilters from './ActiveFilters';
import CategoryFilters from './CategoryFilters';
import ClassFilters from './ClassFilters';
import ChapterFilters from './ChapterFilters';

const ArticleSidebar = ({
    showMobileSidebar,
    selectedType,
    selectedClass,
    selectedChapter,
    searchTerm,
    isChapterCodeClass,
    codes,
    articles,
    getTypeDescription,
    getClassDescription,
    getChapterDescription,
    setSelectedType,
    setSelectedClass,
    setSelectedChapter,
    setCurrentPage,
    setShowMobileSidebar,
    handleResetFilters
}) => {
    return (
        <div className={`${showMobileSidebar ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5`}>
            {/* Active filters */}
            <ActiveFilters
                selectedType={selectedType}
                selectedClass={selectedClass}
                selectedChapter={selectedChapter}
                searchTerm={searchTerm}
                isChapterCodeClass={isChapterCodeClass}
                getTypeDescription={getTypeDescription}
                getClassDescription={getClassDescription}
                getChapterDescription={getChapterDescription}
                setSelectedType={setSelectedType}
                setSelectedClass={setSelectedClass}
                setSelectedChapter={setSelectedChapter}
                setCurrentPage={setCurrentPage}
                handleResetFilters={handleResetFilters}
            />

            {/* Categories */}
            <CategoryFilters
                codes={codes}
                articles={articles}
                selectedType={selectedType}
                selectedClass={selectedClass}
                searchTerm={searchTerm}
                setSelectedType={setSelectedType}
                setCurrentPage={setCurrentPage}
                setShowMobileSidebar={setShowMobileSidebar}
            />

            {/* Classes */}
            <ClassFilters
                codes={codes}
                articles={articles}
                selectedClass={selectedClass}
                selectedType={selectedType}
                searchTerm={searchTerm}
                setSelectedClass={setSelectedClass}
                setCurrentPage={setCurrentPage}
                setShowMobileSidebar={setShowMobileSidebar}
            />

            {/* Chapters - Only show when a chapter code class is selected */}
            <ChapterFilters
                isChapterCodeClass={isChapterCodeClass}
                codes={codes}
                articles={articles}
                selectedClass={selectedClass}
                selectedType={selectedType}
                selectedChapter={selectedChapter}
                searchTerm={searchTerm}
                setSelectedChapter={setSelectedChapter}
                setCurrentPage={setCurrentPage}
                setShowMobileSidebar={setShowMobileSidebar}
            />
        </div>
    );
};

export default ArticleSidebar;
