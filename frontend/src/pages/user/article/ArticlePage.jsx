import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../../layouts/UserLayout";
import { fetchArticleById, fetchArticles } from "../../../features/article/articleSlice";
import { fetchCodesByType } from "../../../features/code/codeSlice";
import LoadingSpinner from "../../../components/loading/LoadingSpinner";
import { Filter, X, Calendar } from "lucide-react";

// Import components
import ArticleBreadcrumb from "../../../components/article/ArticleBreadcrumb";
import ArticleHeader from "../../../components/article/ArticleHeader";
import ArticleContent from "../../../components/article/ArticleContent";
import ArticleRelatedSidebar from "../../../components/article/ArticleRelatedSidebar";
import SearchBar from "../../../components/article/SearchBar";
import { formatDate } from "../../../utils/formatters";

const ArticlePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { article, articles } = useSelector(state => state.articles);
    const { codes } = useSelector(state => state.codes);
    const { loading } = useSelector(state => state.states);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch article data when component mounts
    useEffect(() => {
        if (id) {
            dispatch(fetchArticleById(id));
            dispatch(fetchCodesByType(["article type", "grade", "chapter"]));
            dispatch(fetchArticles()); // Always fetch articles once
        }
    }, [dispatch, id]);

    // Find related articles based on the same type, class, or chapter
    useEffect(() => {
        if (article && articles && articles.length > 0) {
            // Get the current article's properties
            const currentType = article.type;
            const currentClass = article.class;
            const currentChapter = article.chapter;
            const currentId = article.id;

            // Filter out the current article
            const otherArticles = articles.filter(a => a.id !== currentId);

            // Calculate relevance score for each article
            const articlesWithScore = otherArticles.map(a => {
                let score = 0;

                // Type match (highest priority)
                if (a.type === currentType) score += 5;

                // Class match (medium priority)
                if (a.class === currentClass) score += 3;

                // Chapter match (for chapter-specific classes)
                if (currentChapter && a.chapter === currentChapter) score += 4;

                // Convert raw score to a scale of 1-10
                const normalizedScore = Math.min(10, Math.ceil(score * 10 / 12));

                return { ...a, relevanceScore: normalizedScore };
            });

            // Filter articles with at least some relevance
            const relevantArticles = articlesWithScore.filter(a => a.relevanceScore > 0);

            // Sort by relevance score (highest first)
            relevantArticles.sort((a, b) => b.relevanceScore - a.relevanceScore);

            // Take the top 5 most relevant articles
            const topRelatedArticles = relevantArticles.slice(0, 5);

            if (topRelatedArticles.length > 0) {
                setRelatedArticles(topRelatedArticles);
            } else {
                // If no related articles found, show the most recent articles
                const recentArticles = [...otherArticles]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);
                setRelatedArticles(recentArticles);
            }
        }
    }, [article, articles]);

    // Format date is now imported from utils/formatters.js

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

    // Handle search
    const handleSearch = (e) => {
        if (e) e.preventDefault();

        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm) {
            navigate(`/articles?search=${encodeURIComponent(trimmedSearchTerm)}`);
        } else {
            navigate("/articles");
        }
    };

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center min-h-screen">
                    <LoadingSpinner color="border-blue-500" size="5rem" />
                </div>
            </>
        );
    }

    if (!article) {
        return (
            <UserLayout>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Không tìm thấy bài viết</h2>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Quay về trang chủ
                    </button>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="flex flex-col min-h-screen bg-gray-50">
                {/* Header with search */}
                

                {/* Breadcrumb */}
                <ArticleBreadcrumb articleTitle={article.title} />

                {/* Main content */}
                <div className="flex-grow container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main content */}
                        <div className="flex-1">
                            {/* Article header */}
                            <ArticleHeader
                                article={article}
                                getTypeDescription={getTypeDescription}
                                getClassDescription={getClassDescription}
                                getChapterDescription={getChapterDescription}
                            />

                            {/* Article content */}
                            <ArticleContent content={article.content} />
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/4">
                            {/* Related articles */}
                            <ArticleRelatedSidebar relatedArticles={relatedArticles} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white border-t mt-auto">
                    <div className="container mx-auto px-4 py-4">
                        <div className="text-center text-sm text-gray-500">
                            © {new Date().getFullYear()} Toán Thầy Bee Wiki. Tất cả các quyền được bảo lưu.
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default ArticlePage;