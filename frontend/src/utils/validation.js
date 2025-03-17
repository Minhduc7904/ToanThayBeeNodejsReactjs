import { addError } from "../features/state/stateApiSlice";


export const validateRegister = (data, password2) => {
    const errors = [];

    if (!data.lastName) errors.push("Họ và tên đệm không được để trống.");
    if (!data.firstName) errors.push("Tên không được để trống.");
    if (!data.username) errors.push("Tên đăng nhập không được để trống.");
    if (!data.password) errors.push("Mật khẩu không được để trống.");
    else {
        if (data.password.length < 6) errors.push("Mật khẩu phải có ít nhất 6 ký tự.");
        if (data.password !== password2) errors.push("Mật khẩu nhập lại không khớp.");
    }
    if (data.gender === -1) errors.push("Vui lòng chọn giới tính.");
    if (!data.birthDate) errors.push("Vui lòng nhập ngày sinh.");
    if (!data.highSchool) errors.push("Vui lòng nhập trường học.");
    if (!data.class) errors.push("Vui lòng chọn lớp.");
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
        errors.push("Email không hợp lệ.");
    }
    if (data.phone && !/^\d{10}$/.test(data.phone)) {
        errors.push("Số điện thoại phải có 10 chữ số.");
    }
    return errors;
};

export const validationUser = (user, dispatch) => {
    if (!user.lastName) {
        dispatch(addError("Họ và tên đệm không được để trống."));
        return false;
    }
    if (!user.firstName) {
        dispatch(addError("Tên không được để trống."));
        return false;
    }

    if (!user.phone) {
        dispatch(addError("Số điện thoại không được để trống."));
        return false;
    }
    return true;
}

