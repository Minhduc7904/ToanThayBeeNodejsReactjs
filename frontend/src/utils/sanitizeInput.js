export const processRegisterForm = (data) => { 
    // Tạo bản sao của data để tránh thay đổi trực tiếp dữ liệu gốc
    let processedData = { ...data };

    // Trim các giá trị chuỗi, kiểm tra nếu bị undefined/null
    processedData.lastName = processedData.lastName ? processedData.lastName.trim() : "";
    processedData.firstName = processedData.firstName ? processedData.firstName.trim() : "";
    processedData.username = processedData.username ? processedData.username.trim() : "";
    processedData.password = processedData.password ? processedData.password.trim() : "";
    processedData.highSchool = processedData.highSchool ? processedData.highSchool.trim() : null;

    // Nếu email/phone rỗng hoặc không tồn tại, đặt giá trị null thay vì chuỗi rỗng
    processedData.email = processedData.email && processedData.email.trim() !== "" ? processedData.email.trim() : null;
    processedData.phone = processedData.phone && processedData.phone.trim() !== "" ? processedData.phone.trim() : null;

    // Chuyển đổi giới tính thành boolean hoặc giữ nguyên -1 nếu không có giá trị hợp lệ
    processedData.gender = processedData.gender === 1 ? true : processedData.gender === 0 ? false : -1;

    // Hàm chuyển đổi ngày sinh sang chuẩn ISO (YYYY-MM-DD)
    const convertDate = (dateString) => {
        if (!dateString) return null;
        const parts = dateString.split("/"); // Giả sử đầu vào là "DD/MM/YYYY"
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // Định dạng lại thành YYYY-MM-DD
        }
        return null; // Trả về null nếu dữ liệu không hợp lệ
    };

    // Cập nhật ngày sinh đã được chuẩn hóa vào dữ liệu đầu ra
    processedData.birthDate = convertDate(processedData.birthDate);

    return processedData; // Trả về dữ liệu đã được chuẩn hóa
};
