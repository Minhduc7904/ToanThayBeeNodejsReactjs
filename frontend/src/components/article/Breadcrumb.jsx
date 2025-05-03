import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-gray-100 border-b">
            <div className="container mx-auto px-4 py-2">
                <div className="flex items-center text-sm">
                    <span
                        className="hover:text-blue-500 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <Home size={14} className="inline mr-1" />
                        Trang chủ
                    </span>
                    <ChevronRight size={14} className="mx-1" />
                    <span className="text-gray-800 font-medium">
                        Bài viết
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;
