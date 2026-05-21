import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/health", authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "OK",
    });
});

export { router };
