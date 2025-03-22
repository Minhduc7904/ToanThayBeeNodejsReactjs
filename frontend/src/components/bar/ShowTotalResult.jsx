const ShowTotalResult = ({ totalItems, currentPage, limit, IsSort = true, isDelete = true }) => {
    return (totalItems > 0 ? (
        <div className="flex justify-between w-full items-center">
            <div className="flex justify-center items-center gap-2">
                <p className="text-right text-gray-500">
                    Hiển thị {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalItems)} trong tổng số {totalItems} kết quả
                </p>
                {IsSort && (
                    <button
                        // onClick={() => dispatch(setSortOrder())}
                        className="w-[0.75rem] h-[0.75rem] relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="18"
                            viewBox="0 0 16 18"
                            fill="none"
                            className="stroke-gray-500"
                        >
                            <path
                                d="M4 17V7M4 17L1 14M4 17L7 14M12 1V11M12 1L15 4M12 1L9 4"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}
            </div>
            {isDelete && (
                <button
                    // onClick={() => setDeleteMode(!deleteMode)}
                    className="relative">
                    <div className="w-[0.75rem] h-[0.75rem]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11 0V1.02924H14V3.00351H2V1.02924H5V0H11ZM2 13.7731C2 15.002 3 16 4.23145 16H11.7656C12.9971 16 13.9971 15.002 13.9971 13.7731V4.02339H2V13.7731ZM4 6.01949H12V13.2616C12 13.6702 11.666 14.0039 11.2559 14.0039H4.74414C4.33398 14.0039 4 13.6702 4 13.2616V6.01949ZM9 6.98636H11V12.9747H9V6.98636ZM7 6.98636H5V12.9747H7V6.98636Z"
                                // fill={`${deleteMode ? '#DC3545' : '#28A745'}`} 
                                fill="#DC3545"
                            />
                        </svg>
                    </div>
                </button>
            )}

        </div>
    ) : (
        <p className="text-start text-gray-500">Không tìm thấy kết quả nào</p>
    )
    )
}

export default ShowTotalResult;