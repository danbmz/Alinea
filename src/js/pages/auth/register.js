import { validateRegisterForm } from "../../validators/registerForm.js";
import { registerUser } from "../../api/auth.js"; 
import { showAlerts } from "../../helpers/alerts.js";
import { showModal } from "../../components/modals.js";

// Seleccionar elementos del DOM
const form = document.querySelector('.general-form');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        name : form.querySelector('input[name="name"]').value.trim(),
        email : form.querySelector('input[name="email"]').value.trim(),
        password : form.querySelector('input[name="password"]').value,
        confirmPassword : form.querySelector('input[name="confirm_password"]').value
    }

    const errors = validateRegisterForm(formData);

    if (errors.length > 0) {
        showAlerts(errors);
    }

    // If no errors, proceed to register the user via API
    if (errors.length === 0) {
        try {
            const response = await registerUser(formData);
            if (response.ok) {
                // Show success message
                showModal(response.data.message, 'success');
                form.reset();
            } else {
                // Mensajes de error del Backend
                if (response.status === 422 && response.data.data.errors) {
                    showAlerts(response.data.data.errors);
                } else {
                    showModal(response.data.message || 'Error inesperado', 'error');
                }
            }
        } catch (error) {
            showModal('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.', 'error', '/');
        }
    }
});