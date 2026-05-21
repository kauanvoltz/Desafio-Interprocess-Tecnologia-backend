import { Router } from "express";
import { patientController } from "../controllers/patient.controller";

const patientRouter = Router();

patientRouter.get("/", patientController.list);
patientRouter.get("/:id", patientController.findById);
patientRouter.post("/", patientController.create);
patientRouter.put("/:id", patientController.update);

export { patientRouter };
