import { showModal, closeModal } from '../../components/modals.js';
import { showAlerts } from '../../helpers/alerts.js';
import { showMessage } from '../../helpers/alerts.js';
import { deleteProject, getUserProjects, updateProject } from '../../api/dashboardAPI.js';
import { validateNewProjectForm } from '../../validators/dashboard/newProjectForm.js';

(( async () => {
    // CONTENEDOR - donde se renderizan los proyctos
    const projectsContainer = document.querySelector('.projects-container');
    // ESTADO - local de los proyectos
    let projectsArray = [];
    // ESTADO - para aplicar filtros
    let currentFilter = 'all';
    // ESTADO - para busqueda por search
    let searchTerm = '';


    // PRIMERA CARGA - muestra los proyectos del usuario la primera vez que entra a la vista
    async function loadUserProjects() {
        try {
            const response = await getUserProjects();

            // Validamos la respuesta
            if(!response.ok) {
                showModal('Error al cargar tus proyectos', 'error', '/user/projects', 'volver a intentar');
            }

            // Si hay respuesta - actualizamos estado y renderizamos
            setProjects(response.data.data.projects);
            renderProjects();

        } catch (error) {
            showModal('Error al cargar tus proyectos', 'error', '/user/projects', 'volver a intentar');
        }
    }

    // ACTUALIZA UI - funcion encargada de actualizar la UI cuando el estado cambia
    function renderProjects(){
        if(projectsArray.length === 0){
            projectsContainer.classList.remove('projects-list');
            noProjectsMessage("No tienes ningun proyecto. Crea uno para comenzar a trabajar.")
            return;
        }

        const filtered = getFilteredProjects();

        if(filtered.length === 0){
            projectsContainer.classList.remove('projects-list'); // Quitamos el grid para mostrar bien el mensaje
            showMessage(projectsContainer, `No hay proyectos que mostrar.`)
            return;
        } else {
            projectsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar proyectos
            projectsContainer.classList.add('projects-list');

            createProjectCard(filtered);
        }
    }

    // RENDERIZA - las cards de cada proyecto del estado
    function createProjectCard(projects){
        projects.forEach(project => {
            const fecha = new Date(project.estimated_end_date);

            const fechaES = new Intl.DateTimeFormat('es-MX', {
                timeZone: 'UTC', // 👈 clave para evitar que JS recorra la fecha 1 dia
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(fecha);


            const projectElement = document.createElement('div');
            projectElement.classList.add('project-item');
            projectElement.dataset.id = project.id;
            projectElement.innerHTML = `
                <div class="project-item-header" style="background-color: ${project.color};"> 
                    <div class="project-header">
                        <h3 class="header-title" title="Ver Proyecto">${project.project_name}</h3>
                        <div class="project-meta"> 
                            <span class="project-status">${project.project_status}</span>
                            ${project.priority === 'Alta' ? '<span class="project-priority high">Alta</span>' : ''}
                            ${project.priority === 'Media' ? '<span class="project-priority medium">Media</span>' : ''}
                            ${project.priority === 'Baja' ? '<span class="project-priority low">Baja</span>' : ''}
                        </div>
                    </div>
                    <div>
                        <button class="header-btn"> <i class="fa-solid fa-ellipsis"></i> </button>
                    </div>
                    <div class="menu-options">
                        <button class="menu-item edit">Editar</button>
                        <button class="menu-item delete">Eliminar</button>
                    </div>
                </div>
                <div class="project-item-body"> 
                    <div class="project-deadline">
                        <p>Fecha de entrega: <span id="body-date-span">${fechaES}</span></p>
                    </div>
                    <div class="project-progress"> 
                        <label for="avance">Avance: </label>
                        <progress id="avance" value="${project.progress}" max="100"></progress>
                        <span>${project.progress}%</span>
                    </div>
                </div>
                `;
            projectsContainer.appendChild(projectElement);

            // Redireccionamos a la vista del proyecto dando click en el titulo
            const header = projectElement.querySelector('.project-header');
            header.onclick = showProject(project);;
        });
    }

    // REDIRIGE - a la vista individual de cada proyecto
    function showProject(project) {
        return function() {
            window.location.href = `/user/project?id=${project.url}`;
        };
    }

    // NORMALIZA - los tipos de datos de los registros (proyectos) de la base
    function normalizeProjects(projects){
        return projects.map(project => ({
            ...project,
            id: Number(project.id),
            user_id: Number(project.user_id)
        }));
    }

    // ACTUALIZA EL ESTADO - recibe los registros de la base y los guarda en el estado local despues de normalizarlos
    function setProjects(projects){
        projectsArray = normalizeProjects(projects);
    }

    // MENSAJE - muestra un mensaje cuando no existen proyectos creados
    function noProjectsMessage(message){
        projectsContainer.innerHTML = `
            <div class="no-projects-message">${message}</div>
            <div class = "no-projects-actions">
                <a href="/user/projects/create" class="btn">Crear Proyecto</a>
            </div>`;
    }

    // FILTRAR - evento que cambia el valor del estado currentFilter por el seleccionado por el usuario
    const filter = document.querySelector('#status-filter');
    filter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderProjects();
    })

    // BUSQUEDA - se cambia el valor del estado searchTerm por el escrito por el usuario
    const searchInput = document.querySelector('#search-filter');
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.trim().toLowerCase();
        renderProjects();
    });

    // FILTRANDO PROYECTOS - funcion que filtra los proyectos del estado y devuelve los correctos segun el status o termino de busqueda
    function getFilteredProjects() {
        return projectsArray.filter(project => {

            const matchStatus = currentFilter === 'all' 
                || project.project_status === currentFilter;

            const matchSearch = project.project_name
                .toLowerCase()
                .includes(searchTerm);

            return matchStatus && matchSearch;
        });
    }

    // MENU - Abre un menu de opciones en cada proyecto
    document.addEventListener('click', (e) => {
        if(!e.target.classList.contains('header-btn')) return;
        
        const card = e.target.closest('.project-item');
        const menu = card.querySelector('.menu-options')

        document.querySelectorAll('.menu-options.active').forEach(m => {
            if (m !== menu) m.classList.remove('active');
        });

        // 👉 toggle del menú actual
        menu.classList.toggle('active');
    })

    // ELIMINAR - activa el evento y pregunta antes de borrar el proyecto de la base
    document.addEventListener('click', (e) => {
        if(!e.target.classList.contains('delete')) return;

        const card = e.target.closest('.project-item');
        const id = Number(card.dataset.id);

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
                await remove(card, id);
            }
        });  

        const menu = card.querySelector('.menu-options');
        menu.classList.remove('active');
    })

    // FUNCION ELIMINAR - funcion que elimina la tarea del estado y de la base
    async function remove(card, id){
        try {
            const response = await deleteProject(id);

            if(response.ok){
                projectsArray = projectsArray.filter(project => project.id !== id);

                card.classList.add('fadeOut');
                setTimeout(()=> {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "Proyecto eliminado exitosamente!",
                        icon: "success",
                        timer: 2500
                    });

                    renderProjects();
                }, 300)
            } else {
                showModal(response.data.message, 'error')
            }
        } catch (error) {
            showModal('Error al procesar la solicitud, intentalo de nuevo más tarde.', 'error')
        }
    }

    // EDITAR - abre un modal con formulario para editar el proyecto
    document.addEventListener('click', (e) =>{
        if(!e.target.classList.contains('edit')) return;
        const card = e.target.closest('.project-item');
        const cardId = Number(card.dataset.id);

        const menu = card.querySelector('.menu-options');
        menu.classList.remove('active');

        editFormModal(cardId);
    })

    // MODAL FORMULARIO EDITAR - crea el modal con un formulario
    function editFormModal(cardId){
        const modal = document.createElement("DIV");
        modal.classList.add("modal");

        let form = "";

        // Navegamos el estado para acceder a los datos del proyecto correspondiente al proyecto seleccionado
        projectsArray.forEach(project => {
            if(project.id === cardId) {
                form = `
                    <div class="m_form-project">
                        <div class="form-container">
                            <form method="POST" class="general-form">
                                <div class="alerts-container"></div>

                                <div class="form-group">
                                    <label for="name" class="form-label">Nombre del proyecto:</label>
                                    <input type="text" id="name" name="project_name" class="form-input" value="${project.project_name}">
                                </div>
                                <div class="form-group">
                                    <label for="description" class="form-label">Especificaciones:</label>
                                    <textarea id="description" name="description" class="form-input" >${project.description}</textarea>
                                </div>
                                <div class="form-group">
                                    <label for="priority" class="form-label">Prioridad:</label>
                                    <select name="priority" id="priority" class="form-input" >
                                        <option value="" disabled selected>Seleccionar</option>
                                        <option value="Baja"${project.priority === "Baja" ? "selected" : ""}>Baja</option>
                                        <option value="Media"${project.priority === "Media" ? "selected" : ""}>Media</option>
                                        <option value="Alta"${project.priority === "Alta" ? "selected" : ""}>Alta</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="estimated_end_date" class="form-label">Fecha de entrega:</label>
                                    <input type="date" value="${project.estimated_end_date}" id="estimated_end_date" name="estimated_end_date" value="" class="form-input" >
                                </div>
                                <div class="form-group">
                                    <label for="color" class="form-label">Color de la tarjeta:</label>
                                    <input type="color" id="color" name="color" class="form-input" value="${project.color   }">
                                </div>
                                
                                <div class="form_actions">
                                    <input type="submit" class="btn" value="Guardar">
                                </div>
                            </form>
                            <button class="btn-close-modal"><i class="fa-solid fa-x"></i></button>
                        </div>
                    </div>
                `;
            }
        })

        modal.innerHTML = form;

        // Insertamos el modal sobre el BODY
        const body = document.querySelector("body");
        body.classList.add("no-scroll");
        body.appendChild(modal);

        // Seleccionamos el boton Cancelar y agregamos funcion closeModal()
        document.addEventListener('click', (e) => {
            if(!e.target.classList.contains('btn-close-modal')) return;
            closeModal();
        })

        // Si queremos enviar el form
        const formProject = document.querySelector('.general-form');
        formProject.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const dataForm = {
                project_name: formProject.project_name.value.trim(),
                description: formProject.description.value.trim(),
                priority: formProject.priority.value,
                estimated_end_date: formProject.estimated_end_date.value,
                color: formProject.color.value
            }

            const erros = validateNewProjectForm(dataForm);

            // Si no hay errores, entonces creamos la tarea
            if(erros.length === 0){
                try {
                    // Registramos la tarea
                    const response = await updateProject(dataForm, cardId);
                    if(response.ok){
                        // ACTUALIZAMOS EL ESTADO, actualizando el registro correspondiente al editado
                        const updatedProject = response.data.data.project;

                        projectsArray = projectsArray.map(project => {
                            if (project.id === Number(updatedProject.id)) {
                                return updatedProject; // reemplaza el proyecto editado
                            }
                            return project;
                        });

                        modal.remove();
                        renderProjects();
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
            } else { // Mostramos mensajes de error
                showAlerts(erros);
            }
        })
    }

    // Cargamos proyectos al entrar
    await loadUserProjects();
}
))();