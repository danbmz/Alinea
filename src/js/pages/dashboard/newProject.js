import { showAlerts } from '../../helpers/alerts.js';
import { showModal } from '../../components/modals.js';
import { validateNewProjectForm } from '../../validators/dashboard/newProjectForm.js';
import { registerProject } from '../../api/dashboardAPI.js';

const form = document.querySelector('.general-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        project_name: form.project_name.value,
        description: form.description.value,
        priority: form.priority.value,
        estimated_end_date: form.estimated_end_date.value,
        color: form.color.value
    };

    const errors = validateNewProjectForm(data);
    
    if (errors.length > 0) {
        showAlerts(errors);
        return;
    }

    if(errors.length === 0) {
        try {
            const response = await registerProject(data);

            if (response.ok) {
                showModal(response.data.message, 'success', `/user/project?id=${response.data.data.url}`, 'Ver proyecto');
                form.reset();
            } else {
                if(response.status === 422 && response.data.data.errors){
                    showAlerts(response.data.data.errors);
                } else {
                    showModal(response.data.message || 'Error inesperado', 'error', '/user/projects/create');
                }
            }
        } catch (error) {
            showModal('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.', 'error', '/user/projects/create');
            setTimeout(() => {
                window.location.href = '/user/projects/create'
            }, 5000)
        }
    }
})