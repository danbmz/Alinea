import { verifyAccount } from "../../api/auth.js";
import { showModal } from "../../components/modals.js";

(async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        showModal('Token inválido o ausente.', 'error');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000)
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
        showModal(error.message, 'error');
    }
})();