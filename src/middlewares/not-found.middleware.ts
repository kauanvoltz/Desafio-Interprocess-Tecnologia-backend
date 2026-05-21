import { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (req, res) => {
    return res.status(404).json({
        success: false,
        message: "Not Found",
    });
};
