export const formatPhone = (value) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) {
        return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
};

export const normalizePhone = (formatted) => {
    if (!formatted) return "";
    const cleaned = formatted.replace(/\D/g, '');
    const ddd = cleaned.slice(0, 2);
    let number = cleaned.slice(2);
    if (number.length === 8) {
        number = '9' + number;
    }
    return `55${ddd}${number}`; // WhatsApp expects country code + DDD + number.
}