//======================Getting relative time for display in appointment cards======================
const getRelativeTime = (date) => {
    const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto", style: "short" });
    const diffMs = date.getTime() - Date.now();

    const divisions = [
        { unit: "year", ms: 1000 * 60 * 60 * 24 * 365 },
        { unit: "month", ms: 1000 * 60 * 60 * 24 * 30 },
        { unit: "day", ms: 1000 * 60 * 60 * 24 },
        { unit: "hour", ms: 1000 * 60 * 60 },
        { unit: "minute", ms: 1000 * 60 },
        { unit: "second", ms: 1000 },
    ];

    for (const { unit, ms } of divisions) {
        if (Math.abs(diffMs) >= ms || unit === "second") {
            return rtf.format(Math.round(diffMs / ms), unit);
        }
    }
}
export default getRelativeTime;