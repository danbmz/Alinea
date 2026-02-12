export function validateTaskForm(dataForm) {
    const {task_name, description} = dataForm;
    const alerts = [];

    if(!task_name.trim() || !description.trim()){
        alerts.push('Llena los campos antes de crear una tarea.')
    }
    if(task.length > 60){
        alerts.push('El titulo de la tarea no debe ser tan largo.')
    }
    if(description.length > 1000) {
        alerts.push('Tu descripcion excede el limite de caracteres de 1000.')
    }

    return alerts;
}