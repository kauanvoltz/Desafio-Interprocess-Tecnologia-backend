import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

const frontendUrl = process.env.FRONTEND_URL;

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || origin === frontendUrl) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
    })
);

app.use(helmet());
app.use(express.json());
app.use(authMiddleware);
app.use(router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
