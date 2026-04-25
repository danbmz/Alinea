export function validateNewProjectForm(data) {
    const errors = [];

    if(!data.project_name || !data.description || !data.priority || !data.estimated_end_date || !data.color) {
        errors.push('Completa el formulario.');
        return errors;
    }

    if (!data.project_name || data.project_name.trim() === '') {
        errors.push('El nombre del proyecto es obligatorio.');
    }

    if (!data.description || data.description.trim() === '') {
        errors.push('La descripción del proyecto es obligatoria.');
    }

    if (!data.priority) {
        errors.push('Agrega un nivel de prioridad.');
    }

    if (!data.estimated_end_date || isNaN(Date.parse(data.estimated_end_date))) {
        errors.push('Agrega una fecha de entrega.');
    }

    const selectedDate = new Date(data.estimated_end_date);
    const today = new Date();

    // Normalizar horas (muy importante)
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        errors.push('La fecha de entrega no puede ser hoy o anterior al día de hoy.');
    }

    if (!data.color || !/^#([0-9A-Fa-f]{6})$/.test(data.color)) {
        errors.push('Selecciona un color para identificar tu proyecto.');
    }

    return errors;
}