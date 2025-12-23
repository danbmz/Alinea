export function resetFormValidator(data) { 
    const errors = [];

    if (!data.newPassword || !data.confirmPassword) {
        errors.push("La contraseña es requerida.");
    }
    if (data.newPassword !== data.confirmPassword) {
        errors.push("Las contraseñas no coinciden.");
    }

    return errors;
}
