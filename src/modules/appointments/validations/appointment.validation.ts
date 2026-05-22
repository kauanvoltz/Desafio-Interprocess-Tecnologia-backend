import { HttpError } from "../../../utils/http-error";

const allowedDateFormatsErrorMessage = "Invalid appointment date";

export const parseAppointmentStatus = (status?: string) => {
    if (status === undefined) {
        return undefined;
    }

    if (status === "true") {
        return true;
    }

    if (status === "false") {
        return false;
    }

    throw new HttpError(400, "Invalid status filter");
};

const ensureIsDefined = (value: unknown) => value !== undefined && value !== null;

export const ensureRequiredAppointmentFields = (input: { patientId?: string; date?: string; description?: string; status?: boolean; }) => {
    const { patientId, date, description, status } = input;

    if (!patientId) {
        throw new HttpError(400, "patientId is required");
    }

    if (!date) {
        throw new HttpError(400, "date is required");
    }

    if (!description) {
        throw new HttpError(400, "description is required");
    }

    if (!ensureIsDefined(status)) {
        throw new HttpError(400, "status is required");
    }
};

export const parseAppointmentDate = (dateValue: string) => {
    const parsed = new Date(dateValue);

    if (Number.isNaN(parsed.getTime())) {
        throw new HttpError(400, allowedDateFormatsErrorMessage);
    }

    return parsed;
};

const getDateNow = (): Date => {

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).formatToParts(new Date());

    const get = (type: string) => parts.find((p) => p.type === type)?.value;

    const year = get("year");
    const month = get("month");
    const day = get("day");
    const hour = get("hour");
    const minute = get("minute");
    const second = get("second");

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`);
};

export const ensureAppointmentDateNotInFuture = (date: Date) => {
    const dateNow = getDateNow();

    if (date.getTime() > dateNow.getTime()) {
        throw new HttpError(400, "Appointment date cannot be in the future");
    }
};
