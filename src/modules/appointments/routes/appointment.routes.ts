import { Router } from "express";
import { appointmentController } from "../controllers/appointment.controller";

const appointmentRouter = Router();

appointmentRouter.get("/", appointmentController.list);
appointmentRouter.get("/:id", appointmentController.findById);
appointmentRouter.post("/", appointmentController.create);
appointmentRouter.put("/:id", appointmentController.update);

export { appointmentRouter };
