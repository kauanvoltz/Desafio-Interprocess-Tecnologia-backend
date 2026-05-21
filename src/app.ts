import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { corsOptions } from "./config/cors";

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(authMiddleware);
app.use(router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
