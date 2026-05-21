import { NextFunction, Request, Response } from "express";
import { patientService } from "../services/patient.service";

const getFirstOptionalString = (value: unknown): string | undefined => {
    if (Array.isArray(value)) {
        const first = value[0];
        return typeof first === "string" && first.length > 0 ? first : undefined;
    }

    return typeof value === "string" && value.length > 0 ? value : undefined;
};

export const patientController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const patients = await patientService.findAll({
                name: getFirstOptionalString(req.query.name),
                cpf: getFirstOptionalString(req.query.cpf),
                status: getFirstOptionalString(req.query.status),
            });

            return res.status(200).json(patients);
        } catch (error) {
            return next(error);
        }
    },

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const patient = await patientService.findById(getFirstOptionalString(req.params.id) as string);
            return res.status(200).json(patient);
        } catch (error) {
            return next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const patient = await patientService.create(req.body);
            return res.status(201).json(patient);
        } catch (error) {
            return next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const patient = await patientService.update(getFirstOptionalString(req.params.id) as string, req.body);
            return res.status(200).json(patient);
        } catch (error) {
            return next(error);
        }
    },
};
