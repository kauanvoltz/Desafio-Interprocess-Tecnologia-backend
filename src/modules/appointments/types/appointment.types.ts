export type AppointmentFilters = {
    patientId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
};

export type AppointmentInput = {
    patientId?: string;
    date?: string;
    description?: string;
    status?: boolean;
};
