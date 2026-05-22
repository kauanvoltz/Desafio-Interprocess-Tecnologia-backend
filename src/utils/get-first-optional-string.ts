export const getFirstOptionalString = (value: unknown): string | undefined => {
    if (Array.isArray(value)) {
        const first = value[0];
        if (typeof first !== "string") return undefined;

        const trimmed = first.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }

    if (typeof value !== "string") return undefined;

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
};
