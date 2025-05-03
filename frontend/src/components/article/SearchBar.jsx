import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, isMobile = false }) => {
    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder={isMobile ? "Tìm kiếm bài viết..." : "Tìm kiếm..."}
                className={`w-full px-4 ${isMobile ? 'py-2' : 'py-1'} pr-8 text-gray-800 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <Search className={`absolute right-3 ${isMobile ? 'top-2.5' : 'top-1.5'} text-gray-500`} size={isMobile ? 16 : 16} />
        </div>
    );
};

export default SearchBar;
