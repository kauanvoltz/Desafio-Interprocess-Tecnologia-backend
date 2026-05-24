import { NextFunction, Request, Response } from "express";
import { appointmentService } from "../services/appointment.service";
import { getFirstOptionalString } from "../../../utils/get-first-optional-string";

export const appointmentController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const appointments = await appointmentService.findAll({
                patientId: getFirstOptionalString(req.query.patientId),
                status: getFirstOptionalString(req.query.status),
                startDate: getFirstOptionalString(req.query.startDate),
                endDate: getFirstOptionalString(req.query.endDate),
            });

            return res.status(200).json(appointments);
        } catch (error) {
            return next(error);
        }
    },

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const appointment = await appointmentService.findById(getFirstOptionalString(req.params.id) as string);
            return res.status(200).json(appointment);
        } catch (error) {
            return next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const appointment = await appointmentService.create(req.body);
            return res.status(201).json(appointment);
        } catch (error) {
            return next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const appointment = await appointmentService.update(getFirstOptionalString(req.params.id) as string, req.body);
            return res.status(200).json(appointment);
        } catch (error) {
            return next(error);
        }
    },
};
