import { verifyAccount, validateToken } from "../../api/auth.js";
import { showModal } from "../../components/modals.js";


(async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    const responseTkn = await validateToken(token);

    if (!responseTkn.ok) {
        showModal(responseTkn.data.message, 'error');
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
        return;
    }

    try {
        const response = await verifyAccount(token);

        if (response.ok && response.data.data.status === 'already_verified') {
            showModal(response.data.message, 'info', '/login', 'Iniciar Sesión');
        } else if (response.ok) {
            // Mandar a cuenta
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        } else {
            showModal(response.data.message, 'error');
        }
    } catch (error) {
        showModal('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.', 'error', '/forgot');
        setTimeout(() => {
            window.location.reload();
        }, 3000)
    }
})();