// utils/excelParser.js
import xlsx from 'xlsx';

export const parseExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
};


// utils/sanitizeExcelUser.js

export const sanitizeExcelUser = (user) => ({
    username: user.username?.toString().trim() || null,
    password: user.password?.toString().trim() || null,
    firstName: user.firstName?.toString().trim() || '',
    lastName: user.lastName?.toString().trim() || '',
    email: user.email?.toString().trim() || null,
    phone: formatPhone(user.phone),
    birthDate: formatDate(user.birthDate),
    class: user.class?.toString().trim() || null,
    gender: parseGender(user.gender),
    highSchool: user.highSchool?.toString().trim() || 'Chưa cập nhật',
});

function formatPhone(rawPhone) {
    if (!rawPhone) return null;

    let phone = rawPhone.toString().trim();

    // Thêm 0 nếu thiếu
    if (!phone.startsWith('0')) {
        phone = '0' + phone;
    }

    return phone;
}

function formatDate(rawDate) {
    if (!rawDate) return null;

    // Nếu là Date object (hiếm)
    if (rawDate instanceof Date) {
        return rawDate.toISOString().split('T')[0];
    }

    // Nếu là số nguyên → Excel serial date
    if (typeof rawDate === 'number') {
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(excelEpoch.getTime() + rawDate * 86400000); // ms per day
        return date.toISOString().split('T')[0];
    }

    // Nếu là chuỗi có thể parse được
    if (typeof rawDate === 'string') {
        const date = new Date(rawDate);
        return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : null;
    }

    return null;
}

function parseGender(value) {
    if (value === 1 || value === '1' || value === 'nam' || value === 'Nam') return true;
    if (value === 0 || value === '0' || value === 'nữ' || value === 'Nữ') return false;
    return null;
}
