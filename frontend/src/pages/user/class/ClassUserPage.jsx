import UserLayout from "../../../layouts/UserLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { fetchClassesByUser } from "../../../features/class/classSlice"
import InputSearch from "../../../components/input/InputSearch"
import ClassImage from "../../../components/image/ClassImage"
import { setSearch, setCurrentPage, setLimit } from "../../../features/filter/filterSlice"
import Pagination from "../../../components/Pagination"
import { useNavigate } from "react-router-dom"
import JoinClassModal from "../../../components/modal/JoinClassModal"

const ClassUserPage = () => {
    const navigate = useNavigate()
    const { classes } = useSelector(state => state.classes)
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { search, currentPage, limit } = useSelector(state => state.filter);
    const [status, setStatus] = useState('JS');
    const [sortOption, setSortOption] = useState('default');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const sortDropdownRef = useRef();

    useEffect(() => {
        dispatch(fetchClassesByUser())
        if (limit !== 4) dispatch(setLimit(4))
    }, [dispatch])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredClasses = classes.filter(cls =>
        (cls.name?.toLowerCase().includes(search.toLowerCase()) ||
            cls.class_code?.toLowerCase().includes(search.toLowerCase())) &&
        cls.studentClassStatus === status
    )

    const sortedClasses = [...filteredClasses].sort((a, b) => {
        switch (sortOption) {
            case 'az':
                return a.name.localeCompare(b.name);
            case 'za':
                return b.name.localeCompare(a.name);
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            default:
                return 0;
        }
    });

    const startIndex = (currentPage - 1) * limit;
    const paginatedClasses = sortedClasses.slice(startIndex, startIndex + limit);

    return (
        <UserLayout>
            <JoinClassModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <div className="h-[100vh] flex flex-col overflow-y-auto hide-scrollbar items-center bg-[#F7F7F7] pt-10 px-4 gap-8">
                <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">

                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setStatus('JS')}
                                className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium ${status === 'JS' ? 'bg-sky-100 text-sky-700' : 'bg-slate-700 text-white'}`}
                            >
                                Lớp của bạn
                            </button>
                            <button
                                onClick={() => setStatus('WS')}
                                className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium ${status === 'WS' ? 'bg-sky-100 text-sky-700' : 'bg-slate-700 text-white'}`}
                            >
                                Lớp đang chờ
                            </button>
                        </div>


                        <div className="w-full sm:flex-1">
                            <InputSearch
                                placeholder="Tìm kiếm lớp"
                                className="w-full h-10"
                                onDebouncedChange={(value) => {
                                    if (value !== search) {
                                        dispatch(setSearch(value))
                                        dispatch(setCurrentPage(1))
                                    }
                                }}
                            />
                        </div>


                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() => setShowSortDropdown(prev => !prev)}
                                    className="w-full sm:w-auto px-4 py-2 rounded-md bg-white border border-stone-300 text-sm"
                                >
                                    Sắp xếp...
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-50">
                                        <ul className="text-sm text-gray-700">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setSortOption('az'); setShowSortDropdown(false); }}>A - Z</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setSortOption('za'); setShowSortDropdown(false); }}>Z - A</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setSortOption('newest'); setShowSortDropdown(false); }}>Mới nhất</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setSortOption('oldest'); setShowSortDropdown(false); }}>Cũ nhất</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded-md text-sm hover:bg-sky-700"
                            >
                                + Tham gia lớp
                            </button>
                        </div>

                    </div>
                </div>

                <div className="w-full hidden lg:block bg-white rounded-md text-sm overflow-x-auto">
                    <table className="w-full table-auto text-left font-['Be_Vietnam_Pro']">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <tr>
                                <th className="px-4 py-3 text-sm">STT</th>
                                <th className="px-4 py-3 text-sm">Tên lớp</th>
                                <th className="px-4 py-3 text-sm">Thứ</th>
                                <th className="px-4 py-3 text-sm">Thời gian</th>
                                <th className="px-4 py-3 text-sm">Năm học</th>
                                <th className="px-4 py-3 text-sm">Sĩ số</th>
                                <th className="px-4 py-3 text-sm">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedClasses.length > 0 ? (
                                paginatedClasses.map((cls, index) => (
                                    <tr
                                        onClick={() => navigate(`/class/${cls.class_code}`)}
                                        key={cls._id} className="hover:bg-gray-50 cursor-pointer"
                                    >
                                        <td className="px-4 py-3">{startIndex + index + 1}</td>
                                        <td className="px-4 flex flex-row gap-8 py-3 font-medium text-gray-900">
                                            <ClassImage name={cls.name} className="h-20 w-40" />
                                            <div className="flex flex-col justify-center gap-1">
                                                <div className="font-semibold">{cls.name}</div>
                                                <div className="text-xs text-gray-500">Mã lớp: {cls.class_code}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{cls.dayOfWeek || '---'}</td>
                                        <td className="px-4 py-3">{cls.studyTime || 0}</td>
                                        <td className="px-4 py-3">{cls.academicYear || '---'}</td>
                                        <td className="px-4 py-3">{cls.studentCount}</td>
                                        <td className={`px-4 py-3 ${cls.studentClassStatus === 'JS' ? "text-green-500" : "text-yellow-500"}`}>{cls.studentClassStatus === 'JS' ? "Đã tham gia" : "Đang chờ..."}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        Không có lớp nào được tìm thấy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="w-full block lg:hidden space-y-4">
                    {paginatedClasses.length > 0 ? (
                        paginatedClasses.map((cls, index) => (
                            <div key={cls._id} onClick={() => navigate(`/class/${cls.class_code}`)} className="p-4 border bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <ClassImage name={cls.name} className="h-16 w-28" />
                                    <div className="flex flex-col gap-1">
                                        <div className="font-semibold text-base">{cls.name}</div>
                                        <div className="text-xs text-gray-500">Mã lớp: {cls.class_code}</div>
                                        <div className="text-xs">Thứ: {cls.dayOfWeek || '---'} | Giờ: {cls.studyTime || 0}</div>
                                        <div className="text-xs">Năm học: {cls.academicYear || '---'} | Sĩ số: {cls.studentCount}</div>
                                        <div className={`text-sm font-medium ${cls.studentClassStatus === 'JS' ? "text-green-500" : "text-yellow-500"}`}>
                                            {cls.studentClassStatus === 'JS' ? "Đã tham gia" : "Đang chờ..."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500">Không có lớp nào được tìm thấy.</div>
                    )}
                </div>

                <Pagination
                    currentPage={currentPage}
                    limit={limit}
                    totalItems={sortedClasses.length}
                    onPageChange={(p) => dispatch(setCurrentPage(p))}
                />
            </div>
        </UserLayout>
    )
}

export default ClassUserPage