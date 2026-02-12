import { showAlerts } from '../../helpers/alerts.js';
import { showModal } from '../../components/modals.js';
import { validateTaskForm } from '../../validators/dashboard/newTaskForm.js';
import { closeModal } from '../../components/modals.js';
import { getTasks } from '../../api/dashboardAPI.js';
import { registerTask } from '../../api/dashboardAPI.js';

((()=>{
    // Contenedor de las tareas
    const taskContainer = document.querySelector('.tasks-list');

    // Funcion para renderizar tareas en la primera carga
    async function chargeTasks(){
        try {
            const response = await getTasks();
            if(response.data.data.tasks === 0){
                taskContainer.innerHTML = `
                    <div class="no-projects-message">Aún no tienes Tareas creadas. Crea uno ahora para comenzar a trabajar.</div>
                    `;
                    return;
            } 

            if(response.ok) {
                renderTasks(response.data.data.tasks);
            } else {
                showModal('Error al cargar tus tareas', 'error', '/user/project', 'volver a intentar');
            }
        } catch (error) {
            showModal(error || 'Error inesperado', 'error', `/user/projects`);
        }
    }
    
    // FUNCION PARA CREAR NUEVA TAREA
    const newTaskBtn= document.querySelector('#new-task');
    newTaskBtn.addEventListener('click', openModal);

    function openModal() {
        const modal = document.createElement("DIV");
        modal.classList.add("modal");

        // Renderizamos el Formulario y agregamos al contenedor del Modal
        const form = `
        <div class="modal-task">
            <h4>Nuevo Tarea</h4>
            <p class="span-modal">Agrega los datos para registrar un nuevo tarea en tu proyecto.</p>
            <div class="alerts-container"></div>
            <form method="POST" class="general-form">
                <div class="form-group">
                    <label for="task" class="form-label">Tarea:</label>
                    <input 
                        type="text" 
                        id="task" 
                        name="task" 
                        class="form-input" 
                        >
                </div>
                <div class="form-group">
                    <label for="description" class="form-label">Descripción:</label>
                    <textarea 
                        type="text" 
                        id="description" 
                        name="description" 
                        class="form-input" 
                        >
                        </textarea>
                </div>
                <div class="modal-actions">
                    <input type="submit" value="Crear" class="btn" id="create-task-btn">
                </div>
            </form>
            <button class="btn-close-modal" id='cancell-btn'>X</button>
        </div>
        `;
        modal.innerHTML = form;

        // Insertamos el modal sobre el BODY
        const body = document.querySelector("body");
        body.classList.add("no-scroll");
        body.appendChild(modal);

        // Seleccionamos el boton Cancelar y agregamos funcion closeModal()
        const btnCancel = document.querySelector("#cancell-btn");
        btnCancel.onclick = closeModal;

        // Si queremos enviar el form
        const formTask = document.querySelector('.general-form');
        formTask.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Recuperar la id del proyecto mediante la url
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");

            const dataForm = {
                task_name: formTask.task.value,
                description: formTask.description.value,
                project_id: id
            }

            const erros = validateTaskForm(dataForm);

            // Si no hay errores, entonces creamos la tarea
            if(erros.length === 0){
                try {
                    // Registramos la tarea
                    const response = await registerTask(dataForm);
                    if(response.ok){
                        renderTasks(response.data.data.task)
                        modal.remove();
                    } else {
                        if(response.status === 422 && response.data.data.errors){
                            showAlerts(response.data.data.errors);
                        } else {
                            showModal(response.data.message || 'Error inesperado', 'error', `/user/project?id=${id}`);
                        }
                    }
                } catch (error) {
                    showModal(error || 'Error inesperado', 'error', `/user/projects`);
                }
                formTask.reset();
            } else { // Mostramos mensajes de error
                showAlerts(erros);
            }
        })
    }

    // Funcion para renderizar las cards de tareas
    function renderTasks(response){
        const card = document.createElement("DIV");
        card.classList.add('task-card');
        const cardContent = `
            <div class="task-header"> 
                <div class="task-header-top">
                    <span class="task-status">${response.task_status}</span>
                    <label for="task_${response.task_name}" class="task-name">${response.task_name}</label>
                </div>
                <button class="task-btn"> > </button>
                <p class="task-details">${response.description}</p>
            </div>
            <div class="task-checkbox">
                <input type="checkbox" id="task_${response.task_name}" class="checkbox"/>
            </div>
        `;
        card.innerHTML = cardContent;

        // Aqui agregamos las tareas al contenedor
        taskContainer.appendChild(card);
    }

    // Llamamos a la funcion que renderiza las tareas
    chargeTasks();
}))()