import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { patientRouter } from "../modules/patients/routes/patient.routes";

const router = Router();

// router.get("/health", authMiddleware, (req, res) => {
//     return res.status(200).json({
//         message: "OK",
//     });
// });

router.use("/patients", patientRouter);

export { router };
