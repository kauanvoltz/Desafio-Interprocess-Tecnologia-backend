import { Appointment } from "@prisma/client";

export type AppointmentResponse = Appointment;

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
    date: input.date ? new Date(input.date) : undefined,
    description: getOptionalTrimmedString(input.description),
    status: input.status,
});
