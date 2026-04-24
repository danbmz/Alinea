import { logout } from "../../api/auth.js";
import { showModal } from "../../components/modals.js";

(( () => {
    const logOutBtn = document.querySelector(".sb_btn-logout");

    if(logOutBtn){
        logOutBtn.addEventListener('click', async () => {
            const response = await logout();
            if(response.ok){
                window.location = '/login';
            } else {
                showModal(response.data.message, 'error', '/dashboard');
            }
        })
    }

    // Resaltar Icono de ruta actual
    const currentPath = window.location.pathname;

    document.querySelectorAll('.sb_link').forEach(link => {
        if(link.getAttribute('href') === currentPath){
            link.classList.add('active');
        }
    });
}))();
    
