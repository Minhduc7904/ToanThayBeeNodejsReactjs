// Dữ liệu thành tích học sinh
export const achievementData = {
    // Thành tích đại học
    university: {
        title: "Kết quả Đại học 2023-2024",
        description: "Học sinh lớp Toán thầy Bee đạt thành tích xuất sắc trong kỳ thi đại học năm 2023-2024 với nhiều em đạt điểm cao và trúng tuyển vào các trường đại học hàng đầu.",
        stats: [
            {
                value: "95%",
                label: "Học sinh đạt điểm Toán trên 8.0"
            },
            {
                value: "85%",
                label: "Học sinh đỗ nguyện vọng 1"
            },
            {
                value: "25+",
                label: "Học sinh đạt điểm Toán 9.0+"
            },
            {
                value: "10+",
                label: "Trường đại học top đầu"
            }
        ]
    },
    
    // Thành tích THPT Quốc Gia
    highschool: {
        title: "Kết quả THPT Quốc Gia 2024",
        description: "Học sinh lớp Toán thầy Bee đạt kết quả ấn tượng trong kỳ thi THPT Quốc Gia 2024, với nhiều em đạt điểm tuyệt đối và điểm cao.",
        stats: [
            {
                value: "98%",
                label: "Học sinh đạt điểm Toán trên 7.0"
            },
            {
                value: "15+",
                label: "Học sinh đạt điểm Toán 10"
            },
            {
                value: "8.5",
                label: "Điểm Toán trung bình"
            },
            {
                value: "45+",
                label: "Học sinh đạt điểm Toán 9.0+"
            }
        ]
    },
    
    // Thành tích học sinh giỏi
    competition: {
        title: "Học sinh giỏi 2024-2025",
        description: "Học sinh lớp Toán thầy Bee đạt nhiều giải thưởng trong các kỳ thi học sinh giỏi cấp thành phố và quốc gia năm học 2024-2025.",
        stats: [
            {
                value: "5+",
                label: "Giải cấp Quốc gia"
            },
            {
                value: "20+",
                label: "Giải cấp Thành phố"
            },
            {
                value: "2",
                label: "Giải Nhất Quốc gia"
            },
            {
                value: "8",
                label: "Giải Nhất Thành phố"
            }
        ]
    }
};

// Danh sách các tab thành tích
export const achievementTabs = [
    {
        id: "university",
        label: "Đại học 2023-2024"
    },
    {
        id: "highschool",
        label: "THPT Quốc Gia 2024"
    },
    {
        id: "competition",
        label: "Học sinh giỏi 2024-2025"
    }
];
