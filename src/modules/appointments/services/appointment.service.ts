import { prisma } from "../../../lib/prisma";
import { HttpError } from "../../../utils/http-error";
import { mapAppointmentInputToPayload, AppointmentResponse, mapAppointmentToResponse } from "../mappers/appointment.mapper";
import { AppointmentFilters, AppointmentInput } from "../types/appointment.types";
import { ensureAppointmentDateNotInFuture, ensureRequiredAppointmentFields, parseAppointmentDate, parseAppointmentStatus } from "../validations/appointment.validation";
import { patientService } from "../../patients/services/patient.service";

const shouldThrowAppointmentsNotFound = (filters: AppointmentFilters, appointmentsCount: number) => {
    const hasAnyFilter =
        filters.patientId !== undefined ||
        filters.status !== undefined ||
        filters.startDate !== undefined ||
        filters.endDate !== undefined;

    if (hasAnyFilter && appointmentsCount === 0) {
        throw new HttpError(404, "Appointments not found");
    }
};

const buildPatientIdWhere = (patientId?: string) => {
    if (!patientId) return undefined;
    return { patientId };
};

const buildStatusWhere = (status?: string) => {
    const parsedStatus = parseAppointmentStatus(status);
    if (parsedStatus === undefined) return undefined;
    return { status: parsedStatus };
};

const buildDateWhere = (startDate?: string, endDate?: string) => {
    const parsedStart = startDate ? parseAppointmentDate(startDate) : undefined;
    const parsedEnd = endDate ? parseAppointmentDate(endDate) : undefined;

    if (!parsedStart && !parsedEnd) return undefined;

    return {
        date: {
            ...(parsedStart ? { gte: parsedStart } : {}),
            ...(parsedEnd ? { lte: parsedEnd } : {}),
        },
    };
};

export const appointmentService = {
    async findAll(filters: AppointmentFilters): Promise<AppointmentResponse[]> {
        const patientIdWhere = buildPatientIdWhere(filters.patientId);
        const statusWhere = buildStatusWhere(filters.status);
        const dateWhere = buildDateWhere(filters.startDate, filters.endDate);

        const where = { ...(patientIdWhere ?? {}), ...(statusWhere ?? {}), ...(dateWhere ?? {}) };

        const rawAppointments = await prisma.appointment.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                patient: false,
            },
        });

        shouldThrowAppointmentsNotFound(filters, rawAppointments.length);

        return rawAppointments.map(mapAppointmentToResponse);
    },

    async findById(id: string): Promise<AppointmentResponse> {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            throw new HttpError(404, "Appointment not found");
        }

        return mapAppointmentToResponse(appointment);
    },

    async create(input: AppointmentInput): Promise<AppointmentResponse> {
        ensureRequiredAppointmentFields(input);

        const { patientId, date } = input;

        const parsedDate = parseAppointmentDate(date as string);
        ensureAppointmentDateNotInFuture(parsedDate);

        const patient = await patientService.findById(patientId as string);
        if (patient.status !== true) {
            throw new HttpError(404, "Patient not found");
        }

        const payload = mapAppointmentInputToPayload(input);

        const created = await prisma.appointment.create({
            data: {
                patientId: payload.patientId!,
                date: payload.date!,
                description: payload.description!,
                status: payload.status!,
            },
        });

        return mapAppointmentToResponse(created);
    },

    async update(id: string, input: AppointmentInput): Promise<AppointmentResponse> {
        await appointmentService.findById(id);

        const payload = mapAppointmentInputToPayload(input);

        const data: { patientId?: string; date?: Date; description?: string; status?: boolean } = {};

        if (payload.patientId !== undefined) {
            const patient = await patientService.findById(payload.patientId);
            if (patient.status !== true) {
                throw new HttpError(404, "Patient not found");
            }
            data.patientId = payload.patientId;
        }

        if (payload.date !== undefined) {
            ensureAppointmentDateNotInFuture(payload.date);
            data.date = payload.date;
        }

        if (payload.description !== undefined) {
            data.description = payload.description;
        }

        if (payload.status !== undefined) {
            data.status = payload.status;
        }

        const updated = await prisma.appointment.update({
            where: { id },
            data,
        });

        return mapAppointmentToResponse(updated);
    },
};
