export const validators = {
    name: (value) => {
        if (!value.trim()) return "O nome é obrigatório";
        if (value.length < 3) return "O nome deve ter pelo menos 3 caracteres";
        return "";
    },
    whatsapp: (value) => {
        if (!value.trim()) return "O WhatsApp é obrigatório";
        // Expect format: "+<country> <area> <number>"
        const parts = value.split(" ");
        if (parts.length !== 3) return "Formato inválido";
        const [country, area, number] = parts;
        // Country: + + 1–3 digits
        if (!/^\+\d{1,3}$/.test(country)) {
            return "Código do país inválido";
        }
        // Area: 1–4 digits
        if (!/^\d{1,4}$/.test(area)) {
            return "Código de área inválido";
        }
        // Number: 4–10 digits
        if (!/^\d{4,10}$/.test(number)) {
            return "Número inválido";
        }
        // E.164: ensure total length ≤ 15 digits (excluding "+")
        const totalDigits = (country.replace("+", "") + area + number).length;
        if (totalDigits > 15) {
            return "Número excede o limite internacional (15 dígitos)";
        }
        return "";
    },
    dateOfBirth: (value) => {
        if (!value) return "A data de nascimento é obrigatória";
        if (new Date(value) > new Date()) return "A data não pode ser no futuro";
        return "";
    },
};