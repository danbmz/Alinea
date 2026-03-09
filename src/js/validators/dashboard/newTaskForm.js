export function validateTaskForm(dataForm) {
    const {task_name, description} = dataForm;
    const alerts = [];

    if(!task_name.trim() || !description.trim()){
        alerts.push('Llena los campos antes de crear una tarea.')
        return alerts;
    }
    if(task_name.trim().length > 70){
        alerts.push('El título de la tarea no debe ser tan largo.')
    }
    if(description.trim().length < 10 || description.trim().length > 1000) {
        alerts.push('Tu descripcion o es muy corta o muy larga.')
    }

    return alerts;
}