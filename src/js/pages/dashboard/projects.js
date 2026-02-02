import { showModal } from '../../components/modals.js';
import { getUserProjects } from '../../api/dashboardAPI.js';


document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.querySelector('.projects-container');

    // Función para cargar y mostrar los proyectos del usuario
    async function loadUserProjects() {
        const { ok, status, data } = await getUserProjects();

        // Si no hay proyectos mostramos un mensaje
        if(data.data.projects.length === 0) {
            projectsContainer.innerHTML = `
            <div class="no-projects-message">Aún no tienes proyectos creados. Crea uno ahora para comenzar a trabajar en él.</div>
            <div class = "no-projects-actions">
                <a href="/user/projects/create" class="btn">Crear Proyecto</a>
            </div>`;
            return;
        }

        // Si si hay proyectos, los mostramos
        if (ok) {
            projectsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar proyectos
            projectsContainer.classList.add('projects-list');

            data.data.projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.classList.add('project-item');
                projectElement.style.backgroundColor = project.color;
                projectElement.innerHTML = `
                    <h3>${project.project_name}</h3>
                    <p>${project.project_status}</p>
                    <p>${project.priority}</p>
                    <p>${project.estimated_end_date}</p>
                    <p>${project.progress}</p>
                    `;
                projectsContainer.appendChild(projectElement);
            });
        } else {
            showModal('Error al cargar tus proyectos', 'error', '/user/projects', 'volver a intentar');
        }
    }

    // Cargar los proyectos al cargar la página
    await loadUserProjects();
})