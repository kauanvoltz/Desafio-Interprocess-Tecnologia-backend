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

const parseDdMmYyyyHmToDate = (value: string) => {
    // Ex: "17/02/2023 17:02"
    const match = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/.exec(value.trim());
    if (!match) return undefined;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);

    if ([day, month, year, hour, minute].some((n) => Number.isNaN(n))) return undefined;

    const timeZone = "America/Sao_Paulo";
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const toTzParts = (d: Date) => {
        const parts = formatter.formatToParts(d);
        const get = (type: string) => parts.find((p) => p.type === type)?.value;

        return {
            year: Number(get("year")),
            month: Number(get("month")),
            day: Number(get("day")),
            hour: Number(get("hour")),
            minute: Number(get("minute")),
        };
    };

    // Interpreta a data/horário como "local" em America/Sao_Paulo e converte para o instante UTC correto.
    const desiredUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0);

    let utcMs = desiredUtcMs;

    // Faz ajuste iterativo (2x) pra compensar o offset do timezone.
    for (let i = 0; i < 2; i++) {
        const tzParts = toTzParts(new Date(utcMs));
        const tzPartsAsUtcMs = Date.UTC(tzParts.year, tzParts.month - 1, tzParts.day, tzParts.hour, tzParts.minute, 0);
        utcMs += desiredUtcMs - tzPartsAsUtcMs;
    }

    return new Date(utcMs);
};

export const parseAppointmentDate = (dateValue: string) => {
    // Prefer BR format: "DD/MM/YYYY HH:mm"
    const maybeBrParsed = parseDdMmYyyyHmToDate(dateValue);
    if (maybeBrParsed) return maybeBrParsed;

    // Fallback: keep existing behavior for ISO / RFC date strings
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
