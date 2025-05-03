import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../../layouts/UserLayout";
import { fetchArticles } from "../../../features/article/articleSlice";
import { fetchCodesByType } from "../../../features/code/codeSlice";
import LoadingSpinner from "../../../components/loading/LoadingSpinner";
import {
    Filter,
    X,
    BookOpen,
    GraduationCap,
    Calendar,
    User,
    Newspaper,
    ChevronRight
} from "lucide-react";
// Import components
import Breadcrumb from "../../../components/article/Breadcrumb";
import SearchBar from "../../../components/article/SearchBar";
import ArticleSidebar from "../../../components/article/ArticleSidebar";
import ArticleList from "../../../components/article/ArticleList";
import Pagination from "../../../components/pagination/Pagination";
import NoDataFound from "../../../assets/images/error-file.png"

const ArticleListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { articles } = useSelector(state => state.articles);
    const { codes } = useSelector(state => state.codes);
    const { loading } = useSelector(state => state.states);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of articles per page

    // Parse query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const typeParam = params.get("type");
        const classParam = params.get("class");
        const chapterParam = params.get("chapter");
        const searchParam = params.get("search");
        const pageParam = params.get("page");

        if (typeParam) setSelectedType(typeParam);
        if (classParam) setSelectedClass(classParam);
        if (chapterParam) setSelectedChapter(chapterParam);
        if (searchParam) setSearchTerm(searchParam);
        if (pageParam && !isNaN(parseInt(pageParam))) {
            setCurrentPage(parseInt(pageParam));
        }
    }, [location.search]);

    // Fetch articles and code data
    useEffect(() => {
        dispatch(fetchArticles());
        dispatch(fetchCodesByType(["article type", "grade", "chapter"]));
    }, [dispatch]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

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

    // Check if the selected class is a chapter code class (10C1, 11C1, 12C1)
    const isChapterCodeClass = selectedClass === "10C1" || selectedClass === "11C1" || selectedClass === "12C1";

    // State for chapter filter
    const [selectedChapter, setSelectedChapter] = useState("");

    // Reset chapter filter when class changes
    useEffect(() => {
        if (!isChapterCodeClass) {
            setSelectedChapter("");
        }
    }, [selectedClass, isChapterCodeClass]);

    // Filter articles based on search term and selected filters
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = searchTerm === "" ||
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.content.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = selectedType === "" || article.type === selectedType;
            const matchesClass = selectedClass === "" || article.class === selectedClass;
            const matchesChapter = !isChapterCodeClass || selectedChapter === "" || article.chapter === selectedChapter;

            return matchesSearch && matchesType && matchesClass && matchesChapter;
        });
    }, [articles, searchTerm, selectedType, selectedClass, selectedChapter, isChapterCodeClass]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    // Get current page items
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredArticles, currentPage, itemsPerPage]);

    // Update URL with current filters and page
    const updateURL = (page = currentPage) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (selectedType) params.append("type", selectedType);
        if (selectedClass) params.append("class", selectedClass);
        if (isChapterCodeClass && selectedChapter) params.append("chapter", selectedChapter);
        if (page > 1) params.append("page", page.toString());

        navigate(`/articles?${params.toString()}`);
    };

    // Handle search form submission
    const handleSearch = (e) => {
        if (e) e.preventDefault();

        // Reset to first page when searching
        setCurrentPage(1);
        updateURL(1);

        // Close mobile sidebar on mobile
        if (window.innerWidth < 768) {
            setShowMobileSidebar(false);
        }
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        updateURL(pageNumber);

        // Scroll to top of the article list
        window.scrollTo({
            top: document.querySelector('.article-list-container')?.offsetTop - 100 || 0,
            behavior: 'smooth'
        });
    };

    // Reset all filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedType("");
        setSelectedClass("");
        setSelectedChapter("");
        setCurrentPage(1);
        navigate("/articles");
    };



    return (
        <UserLayout>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <LoadingSpinner color="border-blue-500" size="5rem" />
                </div>
            ) : (
                <>
                    <div className="flex flex-col min-h-screen bg-gray-50">
                        <Breadcrumb />

                        {/* Mobile search - visible only on mobile */}
                        <div className="flex flex-row gap-2 md:hidden bg-white border-b px-4 py-2">
                            <SearchBar
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                handleSearch={handleSearch}
                                isMobile={true}
                            />
                            <button
                                className="md:hidden bg-blue-700 p-2 rounded-md"
                                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                            >
                                {showMobileSidebar ? <X color="white" size={20} /> : <Filter color="white" size={20} />}
                            </button>
                        </div>

                        {/* Main content */}
                        <div className="flex-grow container mx-auto px-4 py-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Sidebar with filters */}
                                <ArticleSidebar
                                    showMobileSidebar={showMobileSidebar}
                                    selectedType={selectedType}
                                    selectedClass={selectedClass}
                                    selectedChapter={selectedChapter}
                                    searchTerm={searchTerm}
                                    isChapterCodeClass={isChapterCodeClass}
                                    codes={codes}
                                    articles={articles}
                                    getTypeDescription={getTypeDescription}
                                    getClassDescription={getClassDescription}
                                    getChapterDescription={getChapterDescription}
                                    setSelectedType={setSelectedType}
                                    setSelectedClass={setSelectedClass}
                                    setSelectedChapter={setSelectedChapter}
                                    setCurrentPage={setCurrentPage}
                                    setShowMobileSidebar={setShowMobileSidebar}
                                    handleResetFilters={handleResetFilters}
                                />
                                {/* Active filters */}


                                {/* Categories */}


                                {/* Chapters - Only show when a chapter code class is selected */}



                                {/* Main content */}
                                <div className="flex-1">
                                    {/* Articles */}
                                    <div className="bg-white border rounded-md overflow-hidden">
                                        <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
                                            <h2 className="text-lg font-medium text-gray-800">
                                                {selectedType || selectedClass || (isChapterCodeClass && selectedChapter) ? 'Kết quả tìm kiếm' : 'Tất cả bài viết'}
                                            </h2>
                                            <span className="text-sm text-gray-500">{filteredArticles.length} bài viết</span>
                                        </div>

                                        {filteredArticles.length > 0 ? (
                                            <div className="divide-y article-list-container">
                                                {currentItems.map(article => (
                                                    <div key={article.id} className="p-6 hover:bg-gray-50">
                                                        <h3
                                                            className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer mb-2"
                                                            onClick={() => navigate(`/articles/${article.id}`)}
                                                        >
                                                            {article.title}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                                                            <div className="flex items-center">
                                                                <Calendar size={12} className="mr-1" />
                                                                <span>{formatDate(article.createdAt)}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <User size={12} className="mr-1" />
                                                                <span>{article.author}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Newspaper size={12} className="mr-1" />
                                                                <span>{getTypeDescription(article.type)}</span>
                                                            </div>
                                                            {article.class && (
                                                                <div className="flex items-center">
                                                                    <GraduationCap size={12} className="mr-1" />
                                                                    <span>{getClassDescription(article.class)}</span>
                                                                </div>
                                                            )}
                                                            {article.chapter && (
                                                                <div className="flex items-center">
                                                                    <BookOpen size={12} className="mr-1" />
                                                                    <span>{article.chapter}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                            {article.content.replace(/[#*`]/g, '').slice(0, 200)}...
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
                                            <div className="flex items-center flex-col justify-center gap-4 p-4 w-full h-full">
                                                <img src={NoDataFound} alt="No Data Found" className="w-[8rem]" />
                                                <div className="flex flex-col items-center">

                                                    <p className="text-gray-500 text-xl">Không có bài viết nào</p>
                                                    <button
                                                        className="text-xs text-gray-700 italic rounded-md transition-colors"
                                                        onClick={handleResetFilters}
                                                    >
                                                        Xem tất cả bài viết
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="bg-white border-t mt-auto">
                        <div className="container mx-auto px-4 py-4">
                            <div className="text-center text-sm text-gray-500">
                                © {new Date().getFullYear()} Toán Thầy Bee Wiki.
                            </div>
                        </div>
                    </div>

                </>
            )}

        </UserLayout>
    );
};

export default ArticleListPage;
