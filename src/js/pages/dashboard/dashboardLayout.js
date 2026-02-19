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
}))();
    
