import { showAlerts, showMessage } from '../../helpers/alerts.js';
import { showModal } from '../../components/modals.js';
import { validateTaskForm } from '../../validators/dashboard/newTaskForm.js';
import { closeModal } from '../../components/modals.js';
import { checkTask, deleteTask, getTasks, updateTask } from '../../api/dashboardAPI.js';
import { registerTask } from '../../api/dashboardAPI.js';

(( async ()=>{
    // CONTENEDORES de las tareas
    const pendingContainer = document.querySelector('.tasks-list');
    const completedSection = document.querySelector('.completed-task-list');
    const completedContainer = completedSection.querySelector('.completed-section');
    // Recuperar la id del proyecto mediante la url
    const params = new URLSearchParams(window.location.search);
    const url = params.get("id");
    // Variable para manejar estado de tareas
    let tasksArray = [];
    // Boton que abre el modal para crear nueva tarea
    const newTaskBtn= document.querySelector('#new-task');
    newTaskBtn.addEventListener('click', openModal);

    // Funcion que CREA una nueva tarea
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
                task_name: formTask.task.value.trim(),
                description: formTask.description.value.trim(),
                project_id: url
            }

            const erros = validateTaskForm(dataForm);

            // Si no hay errores, entonces creamos la tarea
            if(erros.length === 0){
                try {
                    // Registramos la tarea
                    const response = await registerTask(dataForm);
                    if(response.ok){
                        // ACTUALIZAMOS EL ESTADO, agregando la nueva tarea
                        const newTask = response.data.data.task; 
                        newTask.forEach(task => tasksArray.push(task));
                        modal.remove();
                        renderTasks();
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
    function renderTasks(){
        // Verificamos que existe el mensaje, y si existe lo eliminamos.
        const message = document.querySelector(".no-projects-message");
        if(message){
            message.remove();
        }

        const pending = tasksArray.filter(t => Number(t.completed) === 0);
        const completed = tasksArray.filter(t => Number(t.completed) === 1);
        console.log(completed);

        renderPendingTasks(pending);
        renderCompletedTasks(completed);

        completedSection.classList.toggle("hidden", completed.length === 0);
    }

    // Funcion para renderizar tareas pendientes
    function renderPendingTasks(tasks){
        pendingContainer.innerHTML = "";

        tasks.forEach(task => {
            const card = createTaskCard(task);
            pendingContainer.appendChild(card);
        });
    }

    // Funcion para renderizar tareas completadas
    function renderCompletedTasks(tasks){
        completedContainer.innerHTML = "";

        tasks.forEach(task => {
            const card = createTaskCard(task);
            completedContainer.appendChild(card);
        });
    }

    // Funcion para crear la card de cada tarea
    function createTaskCard(task){
        const card = document.createElement("DIV");
        card.classList.add('task-card');
        // Transformar a NUMERO
        const completed = Number(task.completed);
        // 1 es true, 0 es false
        completed ? card.classList.add('completed') : ''; 
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
                <input type="checkbox" data-id="${task.id}" ${completed ? 'checked' : ''} class="checkbox"/>
                <span class="task-delete" title="Eliminar">D</span>
            </div>
        `;

        card.innerHTML = cardContent;
        return card;
    }

    // Funcion para renderizar tareas en la primera carga
    async function chargeTasks(){
        try {
            const response = await getTasks(url);

            // Validar que haya respuesta
            if(!response.ok) {
                showModal('Error al cargar tus tareas', 'error', '/user/project', 'volver a intentar');
            }
            // sincronizar las tareas de la base con la variable tasks
            tasksArray = response.data.data.tasks;
            // Si no existen tareas, mostramos un mensaje;
            if(tasksArray.length === 0){
                showMessage(pendingContainer, 'Aún no tienes Tareas creadas. Crea uno ahora para comenzar a trabajar.')
                completedSection.classList.add('hidden');
                return;
            } 

            // Si no hay problemas, renderizamos las tareas
            if(response.ok) {
                renderTasks();
                console.log(tasksArray);
            } 
        } catch (error) {
            showModal(error || 'Error inesperado', 'error', `/user/projects`);
        }
    }

    // ACTUALIZAR - EDITAR NOMBRE DE TAREA
    document.addEventListener('dblclick', (e) => {
        if (!e.target.classList.contains("task-name")) return;

        const span = e.target;
        const currentText = span.textContent;
        const card = span.closest('.task-card');
        const id = card.dataset.id;

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
                task_name: document.querySelector(".edit-input").value.trim(),
                id: id
            };

            if (data.task_name === "") {
                restoreSpan();
                return;
            }

            // enviamos el nuevo valor a la base
            const response = await updateTask(data);

            if(response.ok){
                restoreSpan(data.task_name);
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
       
    // ELIMINAR TAREA
    document.addEventListener('click',async (e) => {

        if(!e.target.classList.contains('task-delete')) return;

        // Ocupamos un nuevo modal para confirmar acciones que quiera realizar el usuario
        const card = e.target.closest('.task-card');
        const deletedId = Number(card.dataset.id);

        // Hacer peticion 
        try {
            const response = await deleteTask(deletedId);
            if(response.ok){
                // Actualizamos el estado, eliminando la tarea correspondiente a la eliminada en la base
                tasksArray = tasksArray.filter(task => task.id !== deletedId);
                // Agregamos animacion de salida
                card.classList.add('fadeOut');
                setTimeout(()=> {
                    card.remove();
                    // Verificamos el estado, si ya no existen tareas, procedemos a mostrar el mensaje.
                    if (tasksArray.length === 0) {
                        showMessage(pendingContainer, 'Aún no tienes Tareas creadas. Crea uno ahora para comenzar a trabajar.');
                    }

                }, 1000)
            } else {
                showModal(response.data.message, 'error')
            }
        } catch (error) {
            showModal('Error interno', 'error')
        }        
    });

    // FUNCION PARA HACER CHECKBOX
    document.addEventListener('change', async (e) => {
        if(!e.target.classList.contains('checkbox')) return;

        const checkbox = e.target;
        const id = Number(checkbox.dataset.id);
        const isChecked = checkbox.checked;

        try {
            // FECTH PARA ACTUALIZAR ESTADO DE LA TAREA`
            const response = await checkTask(id, isChecked);

            // Si la respuesta es positiva actualizamos el estado local de las tareas
            if(response.ok){
                console.log('actualizo los cambios')
                // ✅ Actualizar estado local
                tasksArray = tasksArray.map(task => {
                    if (Number(task.id) === id) {
                        return {
                            ...task,
                            completed: isChecked ? 1 : 0,
                            completed_at: isChecked ? new Date().toISOString() : null
                        };
                    }
                    return task;
                });
            }
            // Y despues actualizamos la UI
            setTimeout(()=> {
                renderTasks();
                const card = checkbox.closest('.task-card');
                card.classList.toggle('completed', isChecked);  
            }, 500)

        } catch (error) {
            // 🔥 rollback visual si falla
            checkbox.checked = !isChecked;
            showModal('Error al actualizar la tarea', 'error');
        }

       
        console.log(tasksArray);

        
    })

    // Llamamos a la funcion que renderiza las tareas
    await chargeTasks();
}))()