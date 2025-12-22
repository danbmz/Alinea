import { validateForgotPasswordForm } from '../../validators/forgotForm.js';
import { forgotPassword } from '../../api/auth.js';
import { showAlerts } from '../../helpers/alerts.js'
import { showModal } from '../../components/modals.js';

// Seleccionar elementos del DOM
const form = document.querySelector('.general-form');

form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const email = document.querySelector('#email').value.trim();
    const errors = validateForgotPasswordForm(email);

    if (errors.length > 0) {
        showAlerts(errors);
    }

    // If no errors, proceed with the form submission
    if (errors.length === 0) {
        try {
            const response = await forgotPassword(email);
            if (response.ok) {
                showModal(response.data.message, 'success');
                form.reset();
            } else {
                // Mensajes de error del Backend
                if (response.status === 422 && response.data.data.errors) {
                    showAlerts(response.data.data.errors);
                } else {
                    showAlerts(response.data.messge || ['Error al enviar el correo. Por favor, inténtalo de nuevo más tarde.']);
                }
            }
        } catch (error) {
            showModal('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.', 'error', '/forgot');
            setTimeout(() => {
                window.location.href = '/forgot';
            }, 3000)
        }
    }

})