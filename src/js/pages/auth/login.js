import { validateLoginForm } from "../../validators/loginForm.js";
import { login } from "../../api/auth.js";
import { showAlerts } from "../../helpers/alerts.js"
import { showModal } from "../../components/modals.js"

const form = document.querySelector('.general-form');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const dataForm = {
        email: form.querySelector('input[name="email"]').value.trim(),
        password: form.querySelector('input[name="password"]').value
    }

    const alerts = validateLoginForm(dataForm);

    if(alerts.length > 0){
        showAlerts(alerts);
    }

    if(alerts.length === 0) {
        try {
            const response = await login(dataForm);
            if(response.ok){
                // Redireccionar a vista de Dashboard
                form.reset();
                window.location.href = 'user/dashboard';
            } else {
                if(response.status === 422 && response.data.data.errors){
                    showAlerts(response.data.data.errors);
                } else {
                    showModal(response.data.message || 'Error inesperado', 'error');
                }
            }
        } catch (error) {
            showModal('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.', 'error', '/');
            setTimeout(() => {
                window.location.href = '/'
            }, 3000)
        }
    }


})