export type PatientFilters = {
    name?: string;
    cpf?: string;
    status?: string;
};

export type PatientInput = {
    name?: string;
    birthDate?: string;
    cpf?: string;
    gender?: string;
    cep?: string;
    city?: string;
    district?: string;
    address?: string;
    complement?: string;
    status?: boolean;
};
