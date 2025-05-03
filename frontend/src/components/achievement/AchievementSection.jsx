import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAchievementDataForHomepage } from '../../features/achievement/achievementSlice';
import { Award } from 'lucide-react';
import SlideShow from '../image/SlideShow';
import LoadingSpinner from '../loading/LoadingSpinner';

const AchievementSection = () => {
    const dispatch = useDispatch();
    const { homepageData, homepageLoading } = useSelector(state => state.achievements);
    const [activeTab, setActiveTab] = useState(null);
    const [tabs, setTabs] = useState([]);

    // Fetch achievement data when component mounts
    useEffect(() => {
        dispatch(fetchAchievementDataForHomepage());
    }, [dispatch]);

    // Set up tabs based on fetched data
    useEffect(() => {
        if (homepageData && homepageData.length > 0) {
            // Create tabs from categories
            const newTabs = homepageData.map(category => ({
                id: category.id,
                label: category.label
            }));

            setTabs(newTabs);

            // Set the first tab as active if none is selected
            if (!activeTab) {
                setActiveTab(homepageData[0].id);
            }
        }
    }, [homepageData, activeTab]);

    // Get the active category data
    const getActiveCategoryData = () => {
        if (!activeTab || !homepageData) return null;
        return homepageData.find(category => category.id === activeTab);
    };

    const activeCategory = getActiveCategoryData();

    // Get images and captions for the active category
    const getActiveImagesData = () => {
        if (!activeCategory || !activeCategory.images) return { images: [], captions: [] };

        const images = activeCategory.images.map(image => image.image_url);

        // Process captions to convert escaped newlines to actual newlines
        const captions = activeCategory.images.map(image =>
            image.caption ? image.caption.replace(/\\n/g, '\n') : ""
        );

        return { images, captions };
    };

    if (homepageLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner 
                    type="border"
                    color="border-blue-600"
                    size="4rem"
                    showText={true}
                    text="Đang tải dữ liệu thành tích..."
                />
            </div>
        );
    }

    if (!homepageData || homepageData.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Không có dữ liệu thành tích.</p>
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-12 bg-gradient-to-b from-[#F0F4C3] to-white overflow-hidden">
            <div className="max-w-screen-xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-cubano mb-4 flex items-center justify-center gap-2">
                        <Award className="w-8 h-8 text-amber-500" />
                        Thành tích học sinh
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tự hào về những thành tích xuất sắc của học sinh lớp Toán thầy Bee qua các kỳ thi quan trọng.
                    </p>
                </div>

                {/* Tab navigation */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? "bg-amber-500 text-white"
                                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeCategory && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left side - Slideshow */}
                        <div className="order-2 lg:order-1">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-4 border-amber-100">
                                <div className="relative">
                                    {/* Decorative elements */}
                                    <div className="absolute top-4 left-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center z-10">
                                        <Award className="w-8 h-8 text-amber-500" />
                                    </div>

                                    {/* Slideshow */}
                                    <div className="w-full h-[400px] md:h-[500px]">
                                        <SlideShow
                                            interval={4000}
                                            images={getActiveImagesData().images}
                                            captions={getActiveImagesData().captions}
                                            h="h-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Achievement stats */}
                        <div className="order-1 lg:order-2">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-amber-600">{activeCategory.title}</h3>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {activeCategory.description ? activeCategory.description.replace(/\\n/g, '\n') : ""}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    {activeCategory.stats && activeCategory.stats.map((stat, index) => (
                                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                                            <div className="text-3xl font-bold text-amber-500 mb-1">{stat.value}</div>
                                            <div className="text-gray-600 text-sm">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors duration-300 flex items-center gap-2 mx-auto lg:mx-0"
                                >
                                    <Award size={16} />
                                    Xem tất cả thành tích
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementSection;
