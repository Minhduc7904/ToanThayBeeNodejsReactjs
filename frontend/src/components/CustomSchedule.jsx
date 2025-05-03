import React, { useState } from 'react';
import ScheduleModal from './ScheduleModal';
import { useSelector } from 'react-redux';
import { CalendarClock } from 'lucide-react';

const CustomSchedule = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { classes } = useSelector((state) => state.classes);
    const { codes } = useSelector((state) => state.codes);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Limit the number of classes shown in the preview
    const displayClasses = classes.slice(0, 3);

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full h-full">
                <div className="bg-emerald-600 text-white py-3 px-4 flex items-center justify-center gap-2">
                    <CalendarClock className="w-5 h-5" />
                    <p className="text-lg sm:text-xl font-bold text-center">Lịch học tuần này</p>
                </div>
                <div className="divide-y divide-gray-200 max-h-[300px] overflow-auto">
                    {displayClasses.length > 0 ? (
                        displayClasses.map((item, index) => (
                            <div
                                key={item.id || index}
                                className={`flex items-center p-3 hover:bg-emerald-50 transition-colors duration-150 cursor-pointer ${
                                    index === 1 ? 'bg-emerald-50' : ''
                                }`}
                                onClick={openModal}
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-emerald-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                    <div className="text-center">
                                        <div className="font-bold text-emerald-800 text-sm sm:text-base">
                                            {item.dayOfWeek === 'CN' ? 'CN' : codes['dow']?.find((code) => code.code === item.dayOfWeek)?.description || item.dayOfWeek}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0"> {/* min-width prevents text overflow */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                        <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</span>
                                        <span className="text-xs sm:text-sm text-emerald-600 font-medium whitespace-nowrap">
                                            {codes['duration']?.find((code) => code.code === item.studyTime)?.description || item.studyTime}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-xs sm:text-sm truncate">{item.academicYear}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            Chưa có lịch học nào trong tuần này
                        </div>
                    )}
                </div>
                <div className="bg-emerald-50 p-3 text-center">
                    <button
                        onClick={openModal}
                        className="text-emerald-600 font-medium hover:text-emerald-800 transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                        <span>Xem lịch học đầy đủ</span>
                        <span className="text-lg">→</span>
                    </button>
                </div>
            </div>

            {/* Schedule Modal */}
            <ScheduleModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
};

export default CustomSchedule;
