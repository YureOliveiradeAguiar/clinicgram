function setupPhoneFormatter(inputId){
    const phoneInput = document.getElementById(inputId);
    if (!phoneInput) {
        console.error(`Element with ID '${inputId}' not found.`);
        return;
    }
    phoneInput.addEventListener('input', function (e) {
        let phoneNumber = e.target.value.replace(/\D/g, '');

        if (phoneNumber.length === 0) {
            e.target.value = '';
            return;
        }
        if (phoneNumber.length <= 2) {
            phoneNumber = `(${phoneNumber}`;
        }
        else if (phoneNumber.length <= 6) {
            phoneNumber = `(${phoneNumber.substring(0, 2)})${phoneNumber.substring(2)}`;
        }
        else {
            phoneNumber = `(${phoneNumber.substring(0, 2)})${phoneNumber.substring(2, 6)}-${phoneNumber.substring(6, 10)}`;
        }
        e.target.value = phoneNumber.substring(0, 14);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    setupPhoneFormatter('idWhatsapp'); // ID of the input field.
});