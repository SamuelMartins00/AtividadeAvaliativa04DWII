/** Valida uma data civil no formato YYYY-MM-DD sem conversões dependentes de fuso. */
function isValidDateOnly(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day;
}

function todayDateOnly() {
    return new Date().toISOString().slice(0, 10);
}

module.exports = { isValidDateOnly, todayDateOnly };
