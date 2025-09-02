export default function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    if (birthDate > today) {
        return "Data inválida";
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjusts if birthday hasn't occurred yet this year.
    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
    }
    if (days < 0) {
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += prevMonth;
        months--;
    }

    // Returns formatted result.
    if (years > 0) {
        return `Idade: ${years} ano${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
        return `Idade: ${months} ${months > 1 ? "meses" : "mês"}`;
    } else {
        return `Idade: ${days} dia${days > 1 ? "s" : ""}`;
    }
};