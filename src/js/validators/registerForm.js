export function validateRegisterForm({ name, email, password, confirmPassword }) {
    const errors = [];

    if (!name || !email || !password || !confirmPassword) {
        errors.push('Todos los campos son obligatorios');
        return errors;
    }

    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (password !== confirmPassword) {
        errors.push('Las contraseñas no coinciden');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push('El correo no es válido');
    }

    return errors; // ✅ sin errores
}
