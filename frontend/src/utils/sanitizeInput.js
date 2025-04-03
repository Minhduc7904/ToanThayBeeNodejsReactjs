export const processRegisterForm = (data) => {
    let processedData = { ...data };

    processedData.lastName = processedData.lastName ? processedData.lastName.trim() : "";
    processedData.firstName = processedData.firstName ? processedData.firstName.trim() : "";
    processedData.username = processedData.username ? processedData.username.trim() : "";
    processedData.password = processedData.password ? processedData.password.trim() : "";
    processedData.highSchool = processedData.highSchool ? processedData.highSchool.trim() : null;

    processedData.email = processedData.email && processedData.email.trim() !== "" ? processedData.email.trim() : null;
    processedData.phone = processedData.phone && processedData.phone.trim() !== "" ? processedData.phone.trim() : null;

    processedData.gender = processedData.gender === 1 ? true : processedData.gender === 0 ? false : -1;

    // Sửa phần ngày sinh
    processedData.birthDate = processedData.birthDate || null;

    return processedData;
};
