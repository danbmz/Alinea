import { showModal } from '../../components/modals.js';
import { getUserProjects } from '../../api/dashboardAPI.js';


document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.querySelector('.projects-container');

    // Función para cargar y mostrar los proyectos del usuario
    async function loadUserProjects() {
        const { ok, data } = await getUserProjects(); // Llamada a la API para obtener los proyectos

        // Si no hay proyectos mostramos un mensaje
        if(data.data.projects.length === 0) {
            projectsContainer.innerHTML = `
            <div class="no-projects-message">Aún no tienes proyectos creados. Crea uno ahora para comenzar a trabajar en él.</div>
            <div class = "no-projects-actions">
                <a href="/user/projects/create" class="btn">Crear Proyecto</a>
            </div>`;
            return;
        }

        // Si si hay proyectos, los renderizamos
        if (ok) {
            projectsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar proyectos
            projectsContainer.classList.add('projects-list');

            data.data.projects.forEach(project => {
                const fecha = new Date(project.estimated_end_date);

                const fechaES = new Intl.DateTimeFormat('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }).format(fecha);


                const projectElement = document.createElement('div');
                projectElement.classList.add('project-item');
                projectElement.innerHTML = `
                    <div class="project-item-header" style="background-color: ${project.color};"> 
                        <h3>${project.project_name}</h3>
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
        } else {
            showModal('Error al cargar tus proyectos', 'error', '/user/projects', 'volver a intentar');
        }
    }

    // Funcion para redirigir al usuario a la página del proyecto
    function showProject(project) {
        return function() {
            window.location.href = `/user/project?id=${project.url}`;
        };
    }

    // Cargar los proyectos al cargar la página
    await loadUserProjects();
})