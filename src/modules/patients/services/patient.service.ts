import { prisma } from "../../../lib/prisma";
import { normalizeCpf } from "../../../utils/cpf";
import { HttpError } from "../../../utils/http-error";
import { mapPatientInputToPayload, PatientResponse } from "../mappers/patient.mapper";
import { PatientFilters, PatientInput } from "../types/patient.types";
import {
    assertPatientPayload,
    ensureRequiredPatientFields,
    ensureValidPatientBirthDate,
    ensureValidPatientCpf,
    ensureUniquePatientCpf,
    ensureValidPatientGender,
    parsePatientStatus,
} from "../validations/patient.validation";

const findCpfConflict = async (cpf: string, patientId?: string) => {
    const patient = await prisma.patient.findUnique({
        where: {
            cpf,
        },
    });

    if (patient && patientId && patient.id === patientId) {
        return null;
    }

    return patient;
};

const shouldThrowPatientsNotFound = (filters: PatientFilters, patients: PatientResponse[]) => {
    const hasAnyFilter =
        filters.name !== undefined || filters.cpf !== undefined || filters.status !== undefined;

    if (hasAnyFilter && patients.length === 0) {
        throw new HttpError(404, "Patients not found");
    }
};

const buildNameFilter = (filters: PatientFilters) => {
    if (!filters.name) return undefined;

    return {
        name: {
            contains: filters.name,
            mode: "insensitive" as const,
        },
    };
};

const buildCpfFilter = (filters: PatientFilters) => {
    if (!filters.cpf) return undefined;

    return {
        cpf: normalizeCpf(filters.cpf),
    };
};

const buildStatusFilter = (status: boolean | undefined) => {
    if (status === undefined) return undefined;

    return { status };
};

export const patientService = {
    async findAll(filters: PatientFilters): Promise<PatientResponse[]> {
        const status = parsePatientStatus(filters.status);

        const nameFilter = buildNameFilter(filters);
        const cpfFilter = buildCpfFilter(filters);
        const statusFilter = buildStatusFilter(status);

        const patients = await prisma.patient.findMany({
            where: { ...(nameFilter ?? {}), ...(cpfFilter ?? {}), ...(statusFilter ?? {}), },
            orderBy: {
                createdAt: "desc",
            },
        });

        shouldThrowPatientsNotFound(filters, patients);

        return patients;
    },

    async findById(id: string): Promise<PatientResponse> {
        const patient = await prisma.patient.findUnique({
            where: { id },
        });

        if (!patient) {
            throw new HttpError(404, "Patient not found");
        }

        return patient;
    },

    async create(input: PatientInput): Promise<PatientResponse> {
        ensureRequiredPatientFields(input);

        const payload = mapPatientInputToPayload(input);

        assertPatientPayload(payload);
        ensureValidPatientGender(payload.gender);

        const existingPatient = await findCpfConflict(payload.cpf as string);
        ensureUniquePatientCpf(existingPatient, undefined);

        return prisma.patient.create({
            data: {
                name: payload.name as string,
                birthDate: payload.birthDate as Date,
                cpf: payload.cpf as string,
                gender: payload.gender as string,
                cep: payload.cep,
                city: payload.city,
                district: payload.district,
                address: payload.address,
                complement: payload.complement,
                status: payload.status as boolean,
            },
        });
    },

    async update(id: string, input: PatientInput): Promise<PatientResponse> {
        // 404 consistente se não existir
        await this.findById(id);

        const payload = mapPatientInputToPayload(input);

        // valida apenas o que veio no payload
        if (payload.birthDate !== undefined) {
            ensureValidPatientBirthDate(payload.birthDate);
        }

        if (payload.cpf !== undefined) {
            ensureValidPatientCpf(payload.cpf);
            const cpfConflict = await findCpfConflict(payload.cpf, id);
            ensureUniquePatientCpf(cpfConflict, id);
        }

        if (payload.gender !== undefined) {
            ensureValidPatientGender(payload.gender);
        }

        const updateData = {
            ...(payload.name !== undefined ? { name: payload.name } : {}),
            ...(payload.birthDate !== undefined ? { birthDate: payload.birthDate } : {}),
            ...(payload.cpf !== undefined ? { cpf: payload.cpf } : {}),
            ...(payload.gender !== undefined ? { gender: payload.gender } : {}),
            ...(payload.cep !== undefined ? { cep: payload.cep } : {}),
            ...(payload.city !== undefined ? { city: payload.city } : {}),
            ...(payload.district !== undefined ? { district: payload.district } : {}),
            ...(payload.address !== undefined ? { address: payload.address } : {}),
            ...(payload.complement !== undefined ? { complement: payload.complement } : {}),
            ...(payload.status !== undefined ? { status: payload.status } : {}),
        };

        return prisma.patient.update({
            where: { id },
            data: updateData,
        });
    },
};
