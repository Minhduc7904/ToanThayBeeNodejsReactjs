const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ 
                message: "Internal Server Error",
                error: process.env.NODE_ENV == "development" ? error : ''});
        }
    }
}

export default asyncHandler;