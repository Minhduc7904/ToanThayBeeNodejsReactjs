import React from 'react';
import ArticleCard from './ArticleCard';
import Pagination from '../pagination/Pagination';
import { ChevronRight } from 'lucide-react';

const ArticleList = ({ 
    filteredArticles, 
    currentItems, 
    currentPage, 
    totalPages, 
    handlePageChange, 
    handleResetFilters,
    isFiltered
}) => {
    return (
        <div className="bg-white border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">
                    {isFiltered ? 'Kết quả tìm kiếm' : 'Tất cả bài viết'}
                </h2>
                <span className="text-sm text-gray-500">{filteredArticles.length} bài viết</span>
            </div>

            {filteredArticles.length > 0 ? (
                <div className="divide-y article-list-container">
                    {currentItems.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="py-6 flex justify-center">
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-8 text-center">
                    <p className="text-gray-500 mb-4">Không tìm thấy bài viết nào phù hợp với tiêu chí tìm kiếm.</p>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        onClick={handleResetFilters}
                    >
                        Xem tất cả bài viết
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArticleList;
