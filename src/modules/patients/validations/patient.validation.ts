import { HttpError } from "../../../utils/http-error";
import { normalizeCpf } from "../../../utils/cpf";
import { PatientInput } from "../types/patient.types";
import { PatientPayload } from "../mappers/patient.mapper";

const allowedGenderValues = ["male", "female", "other"] as const;

export const parsePatientStatus = (status?: string) => {
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

export const ensureRequiredPatientFields = (input: PatientInput) => {
    const { name, birthDate, cpf, gender, status } = input;

    if (!name) {
        throw new HttpError(400, "Name is required");
    }

    if (!birthDate) {
        throw new HttpError(400, "Birth date is required");
    }

    if (!cpf) {
        throw new HttpError(400, "CPF is required");
    }

    if (!gender) {
        throw new HttpError(400, "Gender is required");
    }

    if (status === undefined) {
        throw new HttpError(400, "Status is required");
    }
};

export const ensureValidPatientBirthDate = (birthDate: Date | undefined) => {
    if (!birthDate || Number.isNaN(birthDate.getTime())) {
        throw new HttpError(400, "Invalid birth date");
    }
};

export const ensureValidPatientCpf = (cpf: string | undefined) => {
    if (!cpf) {
        throw new HttpError(400, "CPF is required");
    }

    const normalizedCpf = normalizeCpf(cpf);

    if (normalizedCpf.length !== 11) {
        throw new HttpError(400, "Invalid CPF");
    }
};

export const ensureValidPatientGender = (gender: string | undefined) => {
    if (!gender || !allowedGenderValues.includes(gender as (typeof allowedGenderValues)[number])) {
        throw new HttpError(400, "Invalid gender value");
    }
};

export const ensureUniquePatientCpf = (existingPatient: { id: string } | null, patientId?: string) => {
    if (existingPatient && patientId && existingPatient.id === patientId) {
        return;
    }

    if (existingPatient) {
        throw new HttpError(409, "CPF already registered");
    }
};

export const assertPatientPayload = (payload: PatientPayload) => {
    ensureValidPatientBirthDate(payload.birthDate);
    ensureValidPatientCpf(payload.cpf);
};
