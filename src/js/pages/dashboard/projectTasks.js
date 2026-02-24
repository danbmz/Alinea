import { showAlerts } from '../../helpers/alerts.js';
import { showModal } from '../../components/modals.js';
import { validateTaskForm } from '../../validators/dashboard/newTaskForm.js';
import { closeModal } from '../../components/modals.js';
import { deleteTask, getTasks, updateTask } from '../../api/dashboardAPI.js';
import { registerTask } from '../../api/dashboardAPI.js';

(( async ()=>{
    // Contenedor de las tareas
    const taskContainer = document.querySelector('.tasks-list');
    // Recuperar la id del proyecto mediante la url
    const params = new URLSearchParams(window.location.search);
    const url = params.get("id");

    // Funcion para renderizar tareas en la primera carga
    async function chargeTasks(){
        try {
            const response = await getTasks(url);
            if(response.data.data.tasks.length === 0){
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
            
            const dataForm = {
                task_name: formTask.task.value,
                description: formTask.description.value,
                project_id: url
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
                            showModal(response.data.message || 'Error inesperado', 'error', `/user/project?id=${url}`);
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
    function renderTasks(data){
        // Verificamos que existe el mensaje, y si existe lo eliminamos.
        const message = document.querySelector(".no-projects-message");
        if(message){
            message.remove();
        }

        data.forEach(task => {
            const card = document.createElement("DIV");
            card.classList.add('task-card');
            card.dataset.id = task.id;
            const cardContent = `
                <div class="task-header"> 
                    <div class="task-header-top">
                        <span class="task-status">${task.task_status}</span>
                        <span class="task-name">${task.task_name}</span>
                    </div>
                    <p class="task-details">${task.description}</p>
                </div>
                <div class="task-checkbox">
                    <button class="task-btn" title="Ver descripción"> > </button>
                    <input type="checkbox" data-id="${task.id}" class="checkbox"/>
                    <span class="task-delete" title="Eliminar">D</span>
                </div>
            `;
            card.innerHTML = cardContent;
    
            // Aqui agregamos las tareas al contenedor
            taskContainer.appendChild(card);
        });
    }

    // Funcion para editar nombre de tarea
    document.addEventListener('dblclick', (e) => {
        if (!e.target.classList.contains("task-name")) return;

        const span = e.target;
        const currentText = span.textContent;
        const id = span.dataset.id;

        // Crear input
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentText;
        input.classList.add("edit-input");

        // Reemplazar span por input
        span.replaceWith(input);

        // Enfocar automáticamente
        input.focus();
        input.select();

        // 🔹 Función para restaurar span   
        const restoreSpan = (newValue = currentText) => {
            const newSpan = document.createElement("span");
            newSpan.classList.add("task-name");
            newSpan.dataset.id = id;
            newSpan.textContent = newValue;
            input.replaceWith(newSpan);
        };

        // Util para evitar conflicto entre enter, escape y blur
        let isSaving = false;

        // ✅ Guardar cambios
        const saveChanges = async () => {
            const data = {
                newValue: document.querySelector(".edit-input").value.trim(),
                id: id
            };

            if (data.newValue === "") {
                restoreSpan();
                return;
            }

            // enviamos el nuevo valor a la base
            const response = await updateTask(data);

            if(response.ok){
                restoreSpan(data.newValue);
            } else {
                showModal(response.data.message, 'error')
            }

        };

        // 🎯 Guardar con Enter
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                isSaving = true;
                saveChanges();
            }

            if (e.key === "Escape") {
                isSaving = true;
                restoreSpan();
            }
        });

        // 💾 No guardar al perder foco
        input.addEventListener("blur", () => {
            if(isSaving) return;
            restoreSpan();
        });

    });
       
    // Funcion para eliminar tareas
    document.addEventListener('click',async (e) => {

        if(!e.target.classList.contains('task-delete')) return;

        // Ocupamos un nuevo modal para confirmar acciones que quiera realizar el usuario
        const card = e.target.closest('.task-card');
        const id = card.dataset.id;

        // Hacer peticion 
        try {
            const response = await deleteTask(id);
            if(response.ok){
                card.classList.add('fadeOut');
                setTimeout(()=> {
                    card.remove();
                }, 1000)
            } else {
                showModal(response.data.message, 'error')
            }
        } catch (error) {
            showModal('Error interno', 'error')
        }

        // Si la respuesta es buena, procedemos a borrar

        
    })

    // Llamamos a la funcion que renderiza las tareas
    await chargeTasks();
}))()