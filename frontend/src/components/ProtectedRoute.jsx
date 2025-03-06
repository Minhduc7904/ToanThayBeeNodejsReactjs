import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin } from "../features/auth/authSlice";
import LoadingSpinner from "./loading/LoadingSpinner";

const ProtectedRoute = ({ allowedRoles }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const isChecking = useSelector(state => state.auth.isChecking);

    useEffect(() => {
        if (!user) {
            dispatch(checkLogin()); // Chỉ gọi checkLogin khi user chưa tồn tại
        }
    }, [dispatch]);

    if (isChecking) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner color="border-black" size="5rem"/>
            </div>
        ) // Chờ checkLogin hoàn tất trước khi quyết định
    }

if (!user) {
    return <Navigate to="/login" replace />;
}

if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/dashboard" replace />;
}

return <Outlet />;
};

export default ProtectedRoute;
