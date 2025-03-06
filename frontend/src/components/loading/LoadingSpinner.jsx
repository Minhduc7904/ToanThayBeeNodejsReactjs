const LoadingSpinner = ({ size = "2rem", color = "border-white" }) => {
    return (
        <div
            className={`animate-spin rounded-full border-4 ${color} border-t-transparent`}
            style={{ width: size, height: size }}
        />
    );
};

export default LoadingSpinner;
