import { showModal } from '../../components/modals.js';
import { showMessage } from '../../helpers/alerts.js';
import { getUserProjects } from '../../api/dashboardAPI.js';

(( async () => {
    // CONTENEDOR - donde se renderizan los proyctos
    const projectsContainer = document.querySelector('.projects-container');
    // ESTADO - local de los proyectos
    let projectsArray = [];
    // ESTADO - para aplicar filtros
    let currentFilter = 'all';


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
            noProjectsMessage("No tienes ningun proyecto. Crea uno para comenzar a trabajar.")
            return;
        }

        const filtered = getFilteredProjects();

        if(filtered.length === 0){
            projectsContainer.classList.remove('projects-list'); // Quitamos el grid para mostrar bien el mensaje
            showMessage(projectsContainer, `No tienes proyectos aquí`)
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
            projectElement.innerHTML = `
                <div class="project-item-header" style="background-color: ${project.color};"> 
                    <div class="project-header">
                        <h3>${project.project_name}</h3>
                        <button class="header-btn"> <i class="fa-solid fa-ellipsis"></i> </button>
                    </div>
                    <div class="project-meta"> 
                        <span class="project-status">${project.project_status}</span>
                        ${project.priority === 'Alta' ? '<span class="project-priority high">Alta</span>' : ''}
                        ${project.priority === 'Media' ? '<span class="project-priority medium">Media</span>' : ''}
                        ${project.priority === 'Baja' ? '<span class="project-priority low">Baja</span>' : ''}
                        
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
            projectElement.onclick = showProject(project);
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

    // FILTRAR - 
    const filter = document.querySelector('#status-filter');
    filter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderProjects();
    })

    function getFilteredProjects() {
        if (currentFilter === 'all') return projectsArray;

        return projectsArray.filter(project => 
            project.project_status === currentFilter
        );
    }

    // Cargamos proyectos al entrar
    await loadUserProjects();
}
))();