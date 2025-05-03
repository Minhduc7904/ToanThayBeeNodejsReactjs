import React, { useState, useEffect } from 'react';
import AdminLayout from "../../layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, postImage, deleteImage } from "../../features/image/imageSlice";
import { setSuccessMessage, setErrorMessage } from "../../features/state/stateApiSlice";
import { X, Plus, Trash2, Save } from 'lucide-react';
import PutMultipleImages from '../../components/image/PutMultipleImages';
import { putSlideImagesForClass } from '../../features/class/classSlice';

const HomePageManagement = () => {
    const dispatch = useDispatch();
    const { images } = useSelector((state) => state.images);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('banner');
    
    // State for different image categories
    const [bannerImages, setBannerImages] = useState([]);
    const [calendarImages, setCalendarImages] = useState([]);
    const [momentImages2022, setMomentImages2022] = useState([]);
    const [momentImages2023, setMomentImages2023] = useState([]);
    const [momentImages2024, setMomentImages2024] = useState([]);
    const [scoreImages, setScoreImages] = useState([]);
    const [score2025Images, setScore2025Images] = useState([]);

    useEffect(() => {
        // Fetch all image categories
        dispatch(fetchImages("home_banner"));
        dispatch(fetchImages("home_calendar"));
        dispatch(fetchImages("home_moment_2022"));
        dispatch(fetchImages("home_moment_2023"));
        dispatch(fetchImages("home_moment_2024"));
        dispatch(fetchImages("home_score"));
        dispatch(fetchImages("home_score_2025"));
    }, [dispatch]);

    useEffect(() => {
        // Organize images by category when they're loaded
        if (images) {
            const bannerImgs = images['home_banner']
            const calendarImgs = images['home_calendar']
            const moment2022Imgs = images['home_moment_2022']
            const moment2023Imgs = images['home_moment_2023']
            const moment2024Imgs = images['home_moment_2024']
            const scoreImgs = images['home_score']
            const score2025Imgs = images['home_score_2025']
            
            setBannerImages(bannerImgs);
            setCalendarImages(calendarImgs);
            setMomentImages2022(moment2022Imgs);
            setMomentImages2023(moment2023Imgs);
            setMomentImages2024(moment2024Imgs);
            setScoreImages(scoreImgs);
            setScore2025Images(score2025Imgs);
        }
    }, [images]);

    const handleImageUpload = async (e, category) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            dispatch(setErrorMessage("Vui lòng chọn file hình ảnh"));
            return;
        }

        setIsLoading(true);
        try {
            const result = await dispatch(postImage({ image: file, folder: category })).unwrap();
            if (result && result.file) {
                dispatch(setSuccessMessage("Tải lên hình ảnh thành công"));
                // Refresh the image list
                // dispatch(fetchImages(category));
            }
        } catch (error) {
            dispatch(setErrorMessage("Lỗi khi tải lên hình ảnh: " + error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteImage = async (imageUrl) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hình ảnh này?")) {
            try {
                await dispatch(deleteImage(imageUrl)).unwrap();
                dispatch(setSuccessMessage("Xóa hình ảnh thành công"));
                
                // Determine which category the image belongs to and refresh
                const category = getCategoryFromUrl(imageUrl);
                // if (category) {
                //     dispatch(fetchImages(category));
                // }
            } catch (error) {
                dispatch(setErrorMessage("Lỗi khi xóa hình ảnh: " + error.message));
            }
        }
    };

    // Helper function to determine image category from URL
    const getCategoryFromUrl = (url) => {
        if (url.includes("home_banner")) return "home_banner";
        if (url.includes("home_calendar")) return "home_calendar";
        if (url.includes("home_moment_2022")) return "home_moment_2022";
        if (url.includes("home_moment_2023")) return "home_moment_2023";
        if (url.includes("home_moment_2024")) return "home_moment_2024";
        if (url.includes("home_score")) return "home_score";
        if (url.includes("home_score_2025")) return "home_score_2025";
        return null;
    };

    // Render image gallery for a specific category
    const renderImageGallery = (images, category) => {
        return (
            <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Hình ảnh hiện tại</h3>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            id={`upload-${category}`}
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, category)}
                            disabled={isLoading}
                        />
                        <label
                            htmlFor={`upload-${category}`}
                            className={`bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Plus size={16} />
                            {isLoading ? "Đang tải lên..." : "Thêm hình ảnh"}
                        </label>
                    </div>
                </div>
                
                {images?.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-md">
                        <p className="text-gray-500">Chưa có hình ảnh nào. Hãy thêm hình ảnh mới.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images?.map((image, index) => (
                            <div key={index} className="relative group">
                                <img 
                                    src={image} 
                                    alt={`${category}-${index}`} 
                                    className="w-full h-48 object-cover rounded-md border border-gray-200"
                                />
                                <button
                                    onClick={() => handleDeleteImage(image)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="text-[#090a0a] text-[32px] font-bold font-bevietnam leading-9 mb-6">
                Quản lý nội dung trang chủ
            </div>
            
            {/* Tab navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'banner' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('banner')}
                >
                    Banner chính
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'calendar' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('calendar')}
                >
                    Lịch học
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'moments' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('moments')}
                >
                    Khoảnh khắc
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'scores' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('scores')}
                >
                    Điểm số
                </button>
            </div>
            
            {/* Tab content */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                {activeTab === 'banner' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Banner trang chủ</h2>
                        <p className="text-gray-600 mb-4">
                            Quản lý hình ảnh banner hiển thị ở đầu trang chủ. Kích thước đề xuất: 1920x1080px.
                        </p>
                        {renderImageGallery(bannerImages, "home_banner")}
                    </div>
                )}
                
                {activeTab === 'calendar' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Hình ảnh lịch học</h2>
                        <p className="text-gray-600 mb-4">
                            Quản lý hình ảnh slideshow trong phần lịch học. Kích thước đề xuất: 1200x800px.
                        </p>
                        {renderImageGallery(calendarImages, "home_calendar")}
                    </div>
                )}
                
                {activeTab === 'moments' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Khoảnh khắc các năm</h2>
                        
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">Năm học 2022-2023</h3>
                            {renderImageGallery(momentImages2022, "home_moment_2022")}
                        </div>
                        
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">Năm học 2023-2024</h3>
                            {renderImageGallery(momentImages2023, "home_moment_2023")}
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Năm học 2024-2025</h3>
                            {renderImageGallery(momentImages2024, "home_moment_2024")}
                        </div>
                    </div>
                )}
                
                {activeTab === 'scores' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Hình ảnh điểm số</h2>
                        
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">Điểm số chung</h3>
                            {renderImageGallery(scoreImages, "home_score")}
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Điểm số 2025</h3>
                            {renderImageGallery(score2025Images, "home_score_2025")}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default HomePageManagement;
