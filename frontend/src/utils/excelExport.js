import * as XLSX from 'xlsx';

/**
 * Export attempt data to Excel
 * @param {Array} attempts - Array of attempt objects
 * @param {String} examName - Name of the exam
 */
export const exportAttemptsToExcel = (attempts, examName) => {
    if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
        console.error('No data to export');
        return;
    }

    try {
        // Create worksheet data
        const worksheetData = attempts.map((attempt, index) => {
            return {
                'STT': index + 1,
                'Họ và tên': attempt?.student ? `${attempt.student.lastName} ${attempt.student.firstName}` : 'N/A',
                'Trường': attempt?.student?.highSchool || 'N/A',
                'Lớp': attempt?.student?.class || 'N/A',
                'Email': attempt?.student?.email || 'N/A',
                'Số điện thoại': attempt?.student?.phone || 'N/A',
                'Thời gian bắt đầu': attempt?.startTime ? new Date(attempt.startTime).toLocaleString('vi-VN') : 'N/A',
                'Thời gian kết thúc': attempt?.endTime ? new Date(attempt.endTime).toLocaleString('vi-VN') : 'Chưa nộp',
                'Thời gian làm bài': attempt?.duration || 'Chưa nộp',
                'Điểm': attempt?.score !== undefined ? attempt.score : 'Chưa có',
                'Số câu đúng': attempt?.correctCount !== undefined ? attempt.correctCount : 'N/A',
                'Tổng số câu': attempt?.totalCount !== undefined ? attempt.totalCount : 'N/A',
            };
        });

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);

        // Set column widths
        const columnWidths = [
            { wch: 5 },  // STT
            { wch: 25 }, // Họ và tên
            { wch: 25 }, // Trường
            { wch: 10 }, // Lớp
            { wch: 25 }, // Email
            { wch: 15 }, // Số điện thoại
            { wch: 20 }, // Thời gian bắt đầu
            { wch: 20 }, // Thời gian kết thúc
            { wch: 15 }, // Thời gian làm bài
            { wch: 10 }, // Điểm
            { wch: 10 }, // Số câu đúng
            { wch: 10 }, // Tổng số câu
        ];
        worksheet['!cols'] = columnWidths;

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách bài làm');

        // Generate filename
        const sanitizedExamName = examName ? examName.replace(/[\\/:*?"<>|]/g, '_') : 'exam';
        const fileName = `Danh_sach_bai_lam_${sanitizedExamName}_${new Date().toISOString().slice(0, 10)}.xlsx`;

        // Export to file
        XLSX.writeFile(workbook, fileName);

        return fileName;
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        throw error;
    }
};
