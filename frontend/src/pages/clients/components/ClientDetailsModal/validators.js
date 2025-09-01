import { normalizePhone } from "./phoneUtils";

export const validators = {
    name: (value) => {
        if (!value.trim()) return "O nome é obrigatório";
        if (value.length < 3) return "O nome deve ter pelo menos 3 caracteres";
        return "";
    },
    whatsapp: (value) => {
        if (!value.trim()) return "O WhatsApp é obrigatório";
        const digits = normalizePhone(value); // "5534921412412"
        if (!/^\d{13}$/.test(digits)) return "Número inválido";
        return "";
    },
    dateOfBirth: (value) => {
        if (!value) return "A data de nascimento é obrigatória";
        if (new Date(value) > new Date()) return "A data não pode ser no futuro";
        return "";
    },
};