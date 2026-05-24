export const parseBirthDatePtToDate = (value: string): Date => {
    const trimmed = value.trim();

    // dd/mm/yyyy
    const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
        const day = Number(match[1]);
        const month = Number(match[2]);
        const year = Number(match[3]);

        return new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    // fallback: tenta interpretar como data padrão do JS/ISO
    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) return parsed;

    return parsed;
};

export const formatBirthDateToPtDdMmYyyy = (value: Date): string => {
    const day = String(value.getDate()).padStart(2, "0");
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const year = value.getFullYear();
    return `${day}/${month}/${year}`;
};
