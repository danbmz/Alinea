import { resetFormValidator } from "../../validators/resetForm.js";
import { showAlerts } from "../../helpers/alerts.js";
import { resetPassword, validateToken } from "../../api/auth.js";
import { showModal } from "../../components/modals.js";

const form = document.querySelector('.general-form');

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Validamos el token al cargar la página
(async () => {
    const response = await validateToken(token);

    if (!response.ok) {
        showModal(response.data.message, 'error');
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
        return;
    }
})();

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        newPassword: form.querySelector('#password').value.trim(),
        confirmPassword: form.querySelector('#confirm-password').value.trim(),
    };

    const errors = resetFormValidator(data);

    if(errors.length > 0) {
        showAlerts(errors);
    }

    if (errors.length === 0) {
        try {
            const response = await resetPassword(token, data);

            if (response.ok) {
                showModal(response.data.message, 'succes', '/login', 'Iniciar sesión');
            } else {
                if (response.status === 422 && response.data.data.errors) {
                    showAlerts(response.data.data.errors)
                } else {
                    showModal(response.data.message, 'error');
                }
            }
        } catch (error) {
            showModal('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.', 'error', '/forgot');
            setTimeout(() => {
                window.location.reload();
            }, 3000)
        }

    }

});