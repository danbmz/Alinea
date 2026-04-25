import { getUserProjects } from "../../api/dashboardAPI.js";
import { showModal } from "../../components/modals.js";

((async () => {
    const timeLine = document.querySelector('.timeline');
    const todayProjects = document.querySelector('.todays-projects');
    // Estado
    let projectsArray = [];

    async function getProjects() {
        try {
            const response = await getUserProjects();

            if(response.ok){
                // Actualizamos estado y renderizamos todas las secciones
                setProjects(response.data.data.projects);
                renderTimeLine();
                renderProgressProjects();
            } else {
                showModal('Hubo un error al cargar la página, por favor intentalo más tarde.', 'error');
            }
        } catch (error) {
            showModal('Algo salio mal. Intentalo de nuevo más tarde', 'error');
            console.log(error);
        }
    }

    // Renderiza el time line con la info del estado
    function renderTimeLine(){
        const sortedProjects = [...projectsArray].sort((a, b) => new Date(a.estimated_end_date) - new Date(b.estimated_end_date));
        const firstThree = sortedProjects.slice(0,3);

        firstThree.forEach(project => {
            const fecha = new Date(project.estimated_end_date);

            const fechaES = new Intl.DateTimeFormat('es-MX', {
                timeZone: 'UTC', // 👈 clave para evitar que JS recorra la fecha 1 dia
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(fecha);

            const left = Math.floor((fecha - new Date()) / (1000 * 60 * 60 * 24));

            const container = document.createElement('DIV');
            container.classList.add('time-cont')
            container.innerHTML = `
                <div class="time-content">
                    <div class="time-circle ${left <= 6 ? 'active' : ''}" ></div>
                </div>
                <div class="time-class">
                    <a href="/user/project?id=${project.url}" class="time-name">${project.project_name}</a>
                    <span class="time-date">${fechaES}</span>
                </div>
            `;
            timeLine.appendChild(container)
        });
    }

    // Renderiza la section de proyectos en progreso
    function renderProgressProjects () {
        const activeProjects = projectsArray.filter((project) => project.project_status === 'Activo');
        const selectedProjects = activeProjects.slice(0,3)

        selectedProjects.forEach((project) => {

            const fecha = new Date(project.estimated_end_date);
            const left = Math.ceil((fecha - new Date()) / (1000 * 60 * 60 * 24)) + 1;


            const card = document.createElement('DIV');
            card.classList.add('project-card');
            card.innerHTML = `
                <div class="project-hero">
                    <div class="project-name">
                        <span>${project.project_name}</span>
                    </div>

                    <div class="project-pro"> 
                        <label for="avance">Avance: </label>
                        <progress id="avance" value="${project.progress}" max="100"></progress>
                        <span>${project.progress}%</span>
                    </div>

                    <div class="project-details">
                        <div>
                            ${project.priority === 'Alta' ? `<span class="project-prio priority-alt">${project.priority}</span>`: ''}
                            ${project.priority === 'Media' ? `<span class="project-prio priority-med">${project.priority}</span>`: ''}
                            ${project.priority === 'Baja' ? `<span class="project-prio priority-baj">${project.priority}</span>`: ''}
                        </div>
                        <div class="project-left">
                            <span>Entrega en ${left} días</span>
                        </div>
                    </div>
                </div>
            `;

            todayProjects.appendChild(card);

            const linkCard = card.querySelector('.project-hero');
            linkCard.onclick = viewProject(project);
        });
    }

     // REDIRIGE - a la vista individual de cada proyecto
    function viewProject(project) {
        return function() {
            window.location.href = `/user/project?id=${project.url}`;
        };
    }


    // ACTUALIZA EL ESTADO - recibe los registros de la base y los guarda en el estado local despues de normalizarlos
    function setProjects(projects){
        projectsArray = normalizeProjects(projects);
    }

    // Normaliza el tipo de datos
    function normalizeProjects(projects){
        return projects.map(project => ({
            ...project,
            id: Number(project.id),
            user_id: Number(project.user_id)
        }));
    }


    await getProjects();
}))();