import { Appointment } from "@prisma/client";
import { parseAppointmentDate } from "../validations/appointment.validation";
import { formatAppointmentDateToPtDdMmYyyyHm } from "../../../utils/appointment-date";

export type AppointmentResponse = Omit<Appointment, "date"> & {
    date: string;
};

export type AppointmentPayload = {
    patientId?: string;
    date?: Date;
    description?: string;
    status?: boolean;
};

const getOptionalTrimmedString = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
};

export const mapAppointmentInputToPayload = (input: {
    patientId?: string;
    date?: string;
    description?: string;
    status?: boolean;
}): AppointmentPayload => ({
    patientId: input.patientId,
    date: input.date ? parseAppointmentDate(input.date) : undefined,
    description: getOptionalTrimmedString(input.description),
    status: input.status,
});

export const mapAppointmentToResponse = (appointment: Appointment): AppointmentResponse => {
    return {
        ...appointment,
        date: formatAppointmentDateToPtDdMmYyyyHm(appointment.date),
    };
};
