import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Newspaper, GraduationCap, BookText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formatters';

const ArticleRelatedSidebar = ({ relatedArticles }) => {
    const navigate = useNavigate();
    const { codes } = useSelector(state => state.codes);

    // Get type, class, and chapter descriptions
    const getTypeDescription = (typeCode) => {
        if (!typeCode || !codes || !codes["article type"]) return typeCode;
        const type = codes["article type"].find(t => t.code === typeCode);
        return type ? type.description : typeCode;
    };

    const getClassDescription = (classCode) => {
        if (!classCode || !codes || !codes["grade"]) return classCode;
        const grade = codes["grade"].find(g => g.code === classCode);
        return grade ? grade.description : classCode;
    };

    const getChapterDescription = (chapterCode) => {
        if (!chapterCode || !codes || !codes["chapter"]) return chapterCode;
        const chapter = codes["chapter"].find(c => c.code === chapterCode);
        return chapter ? chapter.description : chapterCode;
    };

    return (
        <div className="bg-white border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium text-gray-700 flex items-center">
                    <BookOpen size={16} className="mr-2" />
                    Bài viết liên quan
                </h3>
            </div>

            {relatedArticles.length > 0 ? (
                <div className="divide-y">
                    {relatedArticles.map(article => (
                        <div
                            key={article.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/article/${article.id}`)}
                        >
                            <h4 className="text-blue-600 hover:text-blue-800 font-medium mb-1">
                                {article.title}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                                {article.createdAt && (
                                    <div className="flex items-center">
                                        <span>{formatDate(article.createdAt)}</span>
                                    </div>
                                )}
                                {article.type && (
                                    <div className="flex items-center">
                                        <Newspaper size={12} className="mr-1" />
                                        <span>{getTypeDescription(article.type)}</span>
                                    </div>
                                )}
                                {article.class && (
                                    <div className="flex items-center">
                                        <GraduationCap size={12} className="mr-1" />
                                        <span>{getClassDescription(article.class)}</span>
                                    </div>
                                )}
                                {article.chapter && (article.class === "10C1" || article.class === "11C1" || article.class === "12C1") && (
                                    <div className="flex items-center">
                                        <BookText size={12} className="mr-1" />
                                        <span>{getChapterDescription(article.chapter)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end mt-2">
                                <button
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/article/${article.id}`);
                                    }}
                                >
                                    Xem chi tiết <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500">
                    Không có bài viết liên quan
                </div>
            )}
        </div>
    );
};

export default ArticleRelatedSidebar;
