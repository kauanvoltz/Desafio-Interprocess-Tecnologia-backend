export const formatAppointmentDateToPtDdMmYyyyHm = (value: Date): string => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(value);

    const get = (type: string) => parts.find((p) => p.type === type)?.value;

    const day = get("day");
    const month = get("month");
    const year = get("year");
    const hour = get("hour");
    const minute = get("minute");

    if (!day || !month || !year || !hour || !minute) {
        return value.toISOString();
    }

    return `${day}/${month}/${year} ${hour}:${minute}`;
};
