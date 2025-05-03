import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';

const Schedule = ({ classes }) => {
    const [isMobile, setIsMobile] = useState(false);

    // Check if the device is mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);
    const getTimeSlotsFromClasses = (classes) => {
        if (!classes || classes.length === 0) return [];

        let minHour = 24;
        let maxHour = 0;

        classes.forEach(cls => {
            const [start, end] = cls.studyTime.split(' - ');
            const [startHour] = start.split(':').map(Number);
            const [endHour] = end.split(':').map(Number);

            minHour = Math.min(minHour, startHour);
            maxHour = Math.max(maxHour, endHour);
        });

        // Tạo mảng các giờ từ min đến max
        const timeSlots = [];
        for (let hour = minHour; hour <= maxHour; hour++) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        return timeSlots;
    };
    const timeSlots = getTimeSlotsFromClasses(classes);


    const weekDays = [
        { short: 'T2', long: 'Thứ 2' },
        { short: 'T3', long: 'Thứ 3' },
        { short: 'T4', long: 'Thứ 4' },
        { short: 'T5', long: 'Thứ 5' },
        { short: 'T6', long: 'Thứ 6' },
        { short: 'T7', long: 'Thứ 7' },
        { short: 'CN', long: 'CN' },
    ];

    const getClassHeight = (startTime, endTime) => {
        const [sh, sm] = startTime.split(':').map(Number);
        const [eh, em] = endTime.split(':').map(Number);
        const durationHours = (eh - sh) + (em - sm) / 60;
        return `${durationHours * 4}rem`;
    };

    return (
        <div className="flex items-center w-full justify-center border border-gray ">
            <div className="bg-white rounded-xl w-full max-h-[50vh] flex flex-col">
                {isMobile && (
                    <div className="bg-blue-50 p-2 text-xs text-blue-700 flex items-center justify-center">
                        <div className="flex items-center">
                            <ChevronLeft size={14} />
                            <span className="mx-1">Kéo ngang để xem thêm</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>
                )}

                {/* Calendar container with horizontal scroll for mobile */}
                <div className="overflow-auto w-full flex-grow">
                    <div className="min-w-[800px]"> {/* Minimum width to ensure horizontal scrolling on mobile */}
                        {/* Calendar header - Days of the week */}
                        <div className="grid grid-cols-[6rem_repeat(7,1fr)] bg-emerald-50 border-b border-gray-200 sticky top-0 z-10">
                            <div className="p-2 border-r border-gray-200 sticky left-0 bg-emerald-50 z-20"></div>
                            {weekDays.map((day, index) => (
                                <div key={index} className="p-2 text-center border-r border-gray-200 last:border-r-0">
                                    <div className="font-semibold text-emerald-800">{day.short}</div>
                                    <div className="text-xs text-gray-500 hidden sm:block">{day.long}</div>
                                </div>
                            ))}
                        </div>

                        {/* Calendar body */}
                        <div className="grid grid-cols-[6rem_repeat(7,1fr)]">
                            {/* Time slots (Y-axis) - Sticky on mobile */}
                            <div className="col-span-1 border-r border-gray-200 sticky left-0 bg-white z-10">
                                {timeSlots.map((time, index) => (
                                    <div
                                        key={index}
                                        className="h-16 border-b border-gray-200 flex items-center justify-center"
                                    >
                                        <span className="text-xs sm:text-sm text-gray-500">{time}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            {weekDays.map((day, dayIndex) => (
                                <div key={dayIndex} className="col-span-1 border-r border-gray-200 last:border-r-0 relative">
                                    {timeSlots.map((_, timeIndex) => (
                                        <div
                                            key={timeIndex}
                                            className="h-16 border-b border-gray-200"
                                        ></div>
                                    ))}

                                    {/* Render class blocks */}
                                    {(() => {
                                        // Get classes for this day
                                        const dayClasses = classes.filter(cls => cls.dayOfWeek === day.short);

                                        // Find overlapping classes
                                        const overlappingGroups = [];

                                        // Process each class
                                        dayClasses.forEach((cls) => {
                                            const [startTime, endTime] = cls.studyTime.split(' - ');
                                            const [startHour, startMin] = startTime.split(':').map(Number);
                                            const [endHour, endMin] = endTime.split(':').map(Number);

                                            // Convert to minutes for easier comparison
                                            const startMinutes = startHour * 60 + startMin;
                                            const endMinutes = endHour * 60 + endMin;

                                            // Check if this class overlaps with any existing group
                                            let foundGroup = false;

                                            for (const group of overlappingGroups) {
                                                // Check if this class overlaps with any class in the group
                                                const overlapsWithGroup = group.some(existingClass => {
                                                    const [eStartTime, eEndTime] = existingClass.studyTime.split(' - ');
                                                    const [eStartHour, eStartMin] = eStartTime.split(':').map(Number);
                                                    const [eEndHour, eEndMin] = eEndTime.split(':').map(Number);

                                                    const eStartMinutes = eStartHour * 60 + eStartMin;
                                                    const eEndMinutes = eEndHour * 60 + eEndMin;

                                                    // Check for overlap
                                                    return (
                                                        (startMinutes < eEndMinutes && endMinutes > eStartMinutes) ||
                                                        (eStartMinutes < endMinutes && eEndMinutes > startMinutes)
                                                    );
                                                });

                                                if (overlapsWithGroup) {
                                                    group.push(cls);
                                                    foundGroup = true;
                                                    break;
                                                }
                                            }

                                            // If no overlapping group found, create a new one
                                            if (!foundGroup) {
                                                overlappingGroups.push([cls]);
                                            }
                                        });

                                        // Render all classes with appropriate positioning
                                        return overlappingGroups.flatMap((group, groupIndex) => {
                                            return group.map((cls, classIndex) => {
                                                const [startTime, endTime] = cls.studyTime.split(' - ');
                                                const [sh, sm] = startTime.split(':').map(Number);
                                                const baseHour = parseInt(timeSlots[0].split(':')[0]);
                                                const top = (sh - baseHour + sm / 60) * 4;

                                                // Calculate width and left position based on number of overlapping classes
                                                const width = group.length > 1 ? `calc((100% - 0.5rem) / ${group.length})` : 'calc(100% - 0.5rem)';
                                                const left = group.length > 1 ? `calc(${classIndex} * (100% / ${group.length}))` : '0';

                                                // Determine color based on class name
                                                let colorClass;

                                                if (cls.name.toLowerCase().includes('đề')) {
                                                    // Lớp có chữ "đề"
                                                    colorClass = 'bg-blue-100 border-blue-500 text-blue-800';
                                                } else if (cls.name.toLowerCase().includes('đại')) {
                                                    // Lớp có chữ "đại"
                                                    colorClass = 'bg-purple-100 border-purple-500 text-purple-800';
                                                } else if (cls.name.toLowerCase().includes('hình')) {
                                                    // Lớp có chữ "hình"
                                                    colorClass = 'bg-amber-100 border-amber-500 text-amber-800';
                                                } else {
                                                    // Các lớp khác
                                                    const defaultColors = [
                                                        'bg-emerald-100 border-emerald-500 text-emerald-800',
                                                        'bg-rose-100 border-rose-500 text-rose-800',
                                                        'bg-cyan-100 border-cyan-500 text-cyan-800',
                                                        'bg-indigo-100 border-indigo-500 text-indigo-800',
                                                        'bg-lime-100 border-lime-500 text-lime-800'
                                                    ];

                                                    // Nếu có nhiều lớp trùng thời gian, sử dụng màu khác nhau
                                                    const colorIndex = group.length > 1 ? classIndex % defaultColors.length : groupIndex % defaultColors.length;
                                                    colorClass = defaultColors[colorIndex];
                                                }

                                                const [bgColor, borderColor, textColor] = colorClass.split(' ');

                                                return (
                                                    <div
                                                        key={cls.id || `${groupIndex}-${classIndex}`}
                                                        className={`absolute mx-1 ${bgColor} border-l-4 ${borderColor} rounded-r-md p-1 sm:p-2 overflow-hidden hover:brightness-95 transition-colors duration-150 cursor-pointer`}
                                                        style={{
                                                            top: `${top}rem`,
                                                            height: getClassHeight(startTime, endTime),
                                                            width: width,
                                                            left: left
                                                        }}
                                                        onClick={() => alert(`Lớp: ${cls.name}\nThời gian: ${cls.studyTime}\nTrạng thái: ${cls.status}`)}
                                                    >
                                                        <div className={`font-semibold text-xs sm:text-sm ${textColor} truncate`}>{cls.name}</div>
                                                        <div className="text-xs text-gray-700">{startTime} - {endTime}</div>
                                                        {!isMobile && cls.description && group.length === 1 && (
                                                            <div className="text-xs text-gray-600 mt-1 truncate">{cls.description}</div>
                                                        )}
                                                        {!isMobile && group.length === 1 && (
                                                            <div className="text-xs text-gray-500 mt-1">{cls.academicYear}</div>
                                                        )}
                                                    </div>
                                                );
                                            });
                                        });
                                    })()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
