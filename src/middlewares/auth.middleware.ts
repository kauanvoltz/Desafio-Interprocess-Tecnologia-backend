import { RequestHandler } from "express";

export const authMiddleware: RequestHandler = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    const apiKey = req.header("x-api-key");
    const expectedApiKey = process.env.API_KEY;

    if (!expectedApiKey || apiKey !== expectedApiKey) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    return next();
};
