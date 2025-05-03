// utils/excelParser.js
import xlsx from 'xlsx';

export const parseExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
};

import removeAccents from 'remove-accents';

export const sanitizeExcelUser = (user) => {
    const fullName = user.lastName?.toString().trim() || '';
    const nameParts = fullName.split(' ').filter(Boolean);

    const firstName = nameParts.pop() || '';
    const lastName = nameParts.join(' ') || '';

    const firstNameSlug = removeAccents(firstName).toLowerCase();

    return {
        username: `${firstNameSlug}${formatPhone(user.username)}`, // ví dụ: "nam0988888888"
        password: formatPhone(user.password),
        firstName: firstName,
        lastName: lastName,
        phone: formatPhone(user.phone),
        class: user.class?.toString().trim() || null,
        highSchool: user.highSchool?.toString().trim() || 'Chưa cập nhật',
    };
};


function formatPhone(rawPhone) {
    if (!rawPhone) return null;

    let phone = rawPhone.toString().trim();

    // Thêm 0 nếu thiếu
    if (!phone.startsWith('0')) {
        phone = '0' + phone;
    }

    return phone;
}
