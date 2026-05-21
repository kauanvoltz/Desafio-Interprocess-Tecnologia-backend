import { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (req, res) => {
    return res.status(404).json({
        message: "Not Found",
    });
};
