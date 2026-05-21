import { ErrorRequestHandler } from "express";

type AppError = {
    statusCode?: number;
    message?: string;
};

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const appError = err as AppError;
    const statusCode = appError.statusCode ?? 500;
    const message = appError.message ?? "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message,
    });
};
