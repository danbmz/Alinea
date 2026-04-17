import { showAlerts, showMessage } from '../../helpers/alerts.js';
import { showModal, closeModal } from '../../components/modals.js';
import { validateTaskForm } from '../../validators/dashboard/newTaskForm.js';
import { registerTask, checkTask, deleteTask, getTasks, updateTask } from '../../api/dashboardAPI.js';

(( async ()=>{
    // CONTENEDORES de las tareas
    const pendingContainer = document.querySelector('.tasks-list');
    const completedSection = document.querySelector('.completed-task-list');
    const completedContainer = completedSection.querySelector('.completed-section');
    // Recuperar la url del proyecto mediante la url de la vista/pagina
    const params = new URLSearchParams(window.location.search);
    const url = params.get("id");
    // Variable para manejar el ESTADO de tareas
    let tasksArray = [];
    // Boton que abre el modal para crear nueva tarea
    const newTaskBtn= document.querySelector('#new-task');
    newTaskBtn.addEventListener('click', openModal);

    // CREA UN MODAL - que contiene el formulario para crear una nueva tarea
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
            <button class="btn-close-modal"><i class="fa-solid fa-x"></i></button>
        </div>
        `;
        modal.innerHTML = form;

        // Insertamos el modal sobre el BODY
        const body = document.querySelector("body");
        body.classList.add("no-scroll");
        body.appendChild(modal);

        // Seleccionamos el boton Cancelar y agregamos funcion closeModal()
        const btnCancel = document.querySelector(".btn-close-modal");
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
                        // ACTUALIZAMOS EL ESTADO, agregando la nueva tarea, despues borramos el modal y volvemos a renderizar
                        addTasks(response.data.data.task);
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

    // PRIMERA CARGA  - Obtiene y renderiza las tareas de la base de datos
    async function loadTasks(){
        try {
            const response = await getTasks(url);

            // Validar que haya respuesta
            if(!response.ok) {
                showModal('Error al cargar tus tareas', 'error', '/user/project', 'volver a intentar');
            }

            // Actualizamos el estado con el resultado de la base
            setTasks(response.data.data.tasks);
            renderTasks();

        } catch (error) {
            showModal(error || 'Error inesperado', 'error', `/user/projects`);
        }
    }

    // NORMALIZA EL TIPO DE DATOS - cambia los numeros como STRINGS a NUMBERS
    function normalizeTasks(tasks){
        return tasks.map(task => ({
            ...task,
            id: Number(task.id),
            completed: Number(task.completed),
            project_id: Number(task.project_id)
        }));
    }

    // ACTUALIZA EL ESTADO - pasando las tareas primero por normalizacion
    function setTasks(tasks){
        tasksArray = normalizeTasks(tasks);
    }

    // AGREGA UNA NUEVA TAREA AL ESTADO - la normaliza y despues agrega al estado
    function addTasks(tasks){
        const normalized = normalizeTasks(tasks);
        tasksArray = [...tasksArray, ...normalized];
    }

    // VALIDA - Verifica que existan tareas a renderizar y llama a las funciones encargadas.
    function renderTasks(){

        const pending = tasksArray.filter(t => Number(t.completed) === 0);
        const completed = tasksArray.filter(t => Number(t.completed) === 1);
        
        renderCompletedTasks(completed);
        renderPendingTasks(pending);
        
        completedSection.classList.toggle("hidden", completed.length === 0);

        // Agregar mensaje si no hay tareas
        if(pending.length === 0){
            showMessage(pendingContainer, 'Crea tu primera tarea para comenzar a trabajar en tu proyecto.')
        }
    }

    // PENDIENTES - Se ocupa de renderizar las tareas pendientes Si existen.
    function renderPendingTasks(tasks){
        pendingContainer.innerHTML = "";

        tasks.forEach(task => {
            const card = createTaskCard(task);
            pendingContainer.appendChild(card);
        });
    }

    // COMPLETADAS - Se ocupa de renderizar las tareas completadas Si existen.
    function renderCompletedTasks(tasks){
        completedContainer.innerHTML = "";

        tasks.forEach(task => {
            const card = createTaskCard(task);
            completedContainer.appendChild(card);
        });
    }

    // RENDERIZA - Crea de 0 cada card para cada tarea
    function createTaskCard(task){
        const card = document.createElement("DIV");
        card.classList.add('task-card');
        // Transformar a NUMERO
        const completed = Number(task.completed);
        // 1 es true, 0 es false
        completed ? card.classList.add('completed') : ''; 
        card.dataset.id = task.id;
        const cardContent = `
            <div class="task-cont">
                <div class="task-header"> 
                    <div class="task-header-top">
                        <span class="task-status">${task.task_status}</span>
                        <span class="task-name">${task.task_name}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn" title="Ver descripción"> <i class="fa-solid fa-eye"></i> </button>
                    <input type="checkbox" data-id="${task.id}" ${completed ? 'checked' : ''} class="checkbox"/>
                    <button class="task-delete" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="task-description">
                <p class="task-details">${task.description}</p>
            </div>
        `;

        card.innerHTML = cardContent;
        return card;
    }

    // DESPLEGAR - la descripcion de cada tarea
    document.addEventListener('click', (e) => {
        if(!e.target.classList.contains('task-btn')) return;

        const card = e.target.closest('.task-card');
        const description = card.querySelector('.task-description');

        description.classList.toggle("active");
    });

    // ACTUALIZAR - Edita el nombre de la tarea
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
       
    // ELIMINAR TAREA - pregunta antes de borrar
    document.addEventListener('click', (e) => {

        if(!e.target.classList.contains('task-delete')) return;

        const card = e.target.closest('.task-card');
        const deletedId = Number(card.dataset.id);

        // Modal para confirmar accion
        Swal.fire({
            title: "¿Estas seguro?",
            text: "No podras deshacer el cambio.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if(result.isConfirmed) {
                await remove(card, deletedId);
            }
        });  
        });

    // ELIMINA TAREA - se encarga de mandar la peticion a la base
    async function remove(card, deletedId){
        try {
            const response = await deleteTask(deletedId);
            if(response.ok){
                // Actualizamos el estado, eliminando la tarea correspondiente a la eliminada en la base
                tasksArray = tasksArray.filter(task => task.id !== deletedId);

                // Agregamos animacion de salida
                card.classList.add('fadeOut');
                setTimeout(()=> {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "Tarea eliminada exitosamente!",
                        icon: "success",
                        timer: 2500
                    });

                    renderTasks();
                }, 300)

            } else {
                showModal(response.data.message, 'error')
            }
        } catch (error) {
            showModal('Error interno', 'error')
        }      
    }

    // CHECKBOX - Marcar tarea como completa
    document.addEventListener('change', async (e) => {
        if(!e.target.classList.contains('checkbox')) return;

        const id = Number(e.target.dataset.id);
        const isChecked = e.target.checked;

        try {
            // FECTH PARA ACTUALIZAR ESTADO DE LA TAREA`
            const response = await checkTask(id, isChecked);

            // Si la respuesta es positiva actualizamos el estado local de las tareas
            if(response.ok){
                // ✅ Actualizar estado local
                tasksArray = tasksArray.map(task => {
                    if (Number(task.id) === id) {
                        return {
                            ...task,
                            task_status: isChecked ? 'Completado' : 'Pendiente',
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
                const card = e.target.closest('.task-card');
                card.classList.toggle('completed', isChecked);  
            }, 500)

        } catch (error) {
            // 🔥 rollback visual si falla
            checkbox.checked = !isChecked;
            showModal('Error al actualizar la tarea', 'error');
        }
    })

    // Llamamos a la funcion que renderiza las tareas la primera vez que entramos a la vista
    await loadTasks();
}))()