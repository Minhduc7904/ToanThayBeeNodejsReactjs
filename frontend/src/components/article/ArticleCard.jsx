import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Calendar, User, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ArticleCard = ({ article }) => {
    const navigate = useNavigate();

    return (
        <div key={article.id} className="p-6 hover:bg-gray-50">
            <h3
                className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer mb-2"
                onClick={() => navigate(`/article/${article.id}`)}
            >
                {article.title}
            </h3>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                    <Newspaper size={14} className="mr-1" />
                    <span>{article.type}</span>
                </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">
                {article.content.replace(/[#*`]/g, '').substring(0, 200)}...
            </p>
            <div className="flex justify-end">
                <button
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    onClick={() => navigate(`/article/${article.id}`)}
                >
                    Đọc tiếp <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ArticleCard;
