import { setErrorMessage } from "../features/state/stateApiSlice";


export const validateRegister = (data, password2, dispatch) => {
    if (!data.lastName) {
        dispatch(setErrorMessage("Họ và tên đệm không được để trống."))
        return false;
    };
    if (!data.firstName) {
        dispatch(setErrorMessage("Tên không được để trống."));
        return false;
    }
    if (!data.username) {
        dispatch(setErrorMessage("Tên đăng nhập không được để trống."))
        return false;
    }
    if (!data.password) {
        dispatch(setErrorMessage("Mật khẩu không được để trống."))
        return false;
    }
    else {
        if (data.password.length < 6) {
            dispatch(setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự."));
            return false;
        }
        if (data.password !== password2) {
            dispatch(setErrorMessage("Mật khẩu nhập lại không khớp."));
            return false;
        }
    }
    if (data.gender === -1) {
        dispatch(setErrorMessage("Vui lòng chọn giới tính."));
        return false;
    }
    if (!data.birthDate) {
        dispatch(setErrorMessage("Vui lòng nhập ngày sinh."));
        return false;
    }
    if (!data.highSchool) {
        dispatch(setErrorMessage("Vui lòng nhập trường học."));
        return false;
    }
    if (!data.class) {
        dispatch(setErrorMessage("Vui lòng chọn lớp."));
        return false;
    }
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
        dispatch(setErrorMessage("Email không hợp lệ."));
        return false;
    }
    if (!data.phone) {
        dispatch(setErrorMessage("Số điện thoại không được để trống."));
        return false;
    }
    if (data.phone && !/^\d{10}$/.test(data.phone)) {
        dispatch(setErrorMessage("Số điện thoại phải có 10 chữ số."));
        return false;
    }
    return true;
};

export const validationUser = (user, dispatch) => {
    if (!user.lastName) {
        dispatch(setErrorMessage("Họ và tên đệm không được để trống."));
        return false;
    }
    if (!user.firstName) {
        dispatch(setErrorMessage("Tên không được để trống."));
        return false;
    }

    if (!user.phone) {
        dispatch(setErrorMessage("Số điện thoại không được để trống."));
        return false;
    }
    return true;
}

