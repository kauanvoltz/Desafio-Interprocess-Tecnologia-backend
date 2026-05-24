import { CorsOptions } from "cors";

const frontendUrl = process.env.FRONTEND_URL;

export const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (!origin || origin === frontendUrl) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
};
