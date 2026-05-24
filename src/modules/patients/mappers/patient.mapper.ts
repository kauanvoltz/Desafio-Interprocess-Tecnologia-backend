import { Patient } from "@prisma/client";
import { PatientInput } from "../types/patient.types";
import { normalizeCpf } from "../../../utils/cpf";
import { formatBirthDateToPtDdMmYyyy, parseBirthDatePtToDate } from "../../../utils/patient-date";

export type PatientResponse = Omit<Patient, "birthDate"> & {
    birthDate: string;
};

export type PatientPayload = {
    name?: string;
    birthDate?: Date;
    cpf?: string;
    gender?: string;
    cep?: string | null;
    city?: string | null;
    district?: string | null;
    address?: string | null;
    complement?: string | null;
    status?: boolean;
};

export const mapPatientInputToPayload = (input: PatientInput): PatientPayload => ({
    name: input.name?.trim(),
    birthDate: input.birthDate ? parseBirthDatePtToDate(input.birthDate) : undefined,
    cpf: input.cpf ? normalizeCpf(input.cpf) : undefined,
    gender: input.gender?.trim(),
    cep: input.cep?.trim() || null,
    city: input.city?.trim() || null,
    district: input.district?.trim() || null,
    address: input.address?.trim() || null,
    complement: input.complement?.trim() || null,
    status: input.status,
});

export const mapPatientToResponse = (patient: Patient): PatientResponse => {
    return {
        ...patient,
        birthDate: formatBirthDateToPtDdMmYyyy(patient.birthDate),
    };
};
