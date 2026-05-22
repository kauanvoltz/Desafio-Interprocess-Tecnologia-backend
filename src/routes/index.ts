import { Router } from "express";
import { patientRouter } from "../modules/patients/routes/patient.routes";
import { appointmentRouter } from "../modules/appointments/routes/appointment.routes";

const router = Router();

router.get("/health", (req, res) => {
    return res.status(200).json({
        message: "OK",
    });
});

router.use("/patients", patientRouter);
router.use("/appointments", appointmentRouter);

export { router };
