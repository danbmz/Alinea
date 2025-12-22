export function validateForgotPasswordForm(email) {
    const errors = [];

    if(!email) {
        errors.push('El correo electrónico es obligatorio.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('El correo electrónico no es válido.');
    }

    return errors;
}