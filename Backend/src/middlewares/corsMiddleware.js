const corsMiddleware = (req, res, next) => {
    // Lấy origin từ request headers
    const origin = req.headers.origin;
    
    // Kiểm tra origin có trong danh sách được phép
    if (origin) {
        // Set các headers CORS cần thiết
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range, X-Content-Range, Authorization');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    next();
};

export default corsMiddleware;