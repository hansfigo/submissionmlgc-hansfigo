export const createResponse = {
    success: ({ res, message, data, status = 200 }) => {
        res.status(status).json({
            status: "success",
            message,
            data,
        });
    },

    error: ({
        res,
        status = 500,
        message = "An error occurred",
    }) => {
        res.status(status).json({
            status: "fail",
            message
        });
    },
};
