import React from 'react';
import { Calendar, User, Newspaper, GraduationCap, BookText } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ArticleHeader = ({ 
    article, 
    getTypeDescription, 
    getClassDescription, 
    getChapterDescription 
}) => {
    // Check if the article belongs to a chapter code class
    const isChapterCodeClass = article.class === "10" || article.class === "11" || article.class === "12";
    
    return (
        <div className="bg-white border rounded-md overflow-hidden mb-6">
            <div className="bg-gray-50 px-6 py-4 border-b">
                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    {article.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                        <User size={16} className="mr-1" />
                        <span>{article.author}</span>
                    </div>
                    <div className="flex items-center">
                        <Newspaper size={16} className="mr-1" />
                        <span>{getTypeDescription(article.type)}</span>
                    </div>
                    {article.class && (
                        <div className="flex items-center">
                            <GraduationCap size={16} className="mr-1" />
                            <span>{getClassDescription(article.class)}</span>
                        </div>
                    )}
                    {/* Only show chapter if article belongs to a chapter code class */}
                    {article.chapter && isChapterCodeClass && (
                        <div className="flex items-center">
                            <BookText size={16} className="mr-1" />
                            <span>{article.chapter}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleHeader;
