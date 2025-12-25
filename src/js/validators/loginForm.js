export function validateLoginForm({ email, password}){
    const errors = [];
    
    if(!email || !password) {
        errors.push('No puedes enviar campos vacios');
    } 

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('El correo electrónico no es válido.');
    } 

    return errors;
}