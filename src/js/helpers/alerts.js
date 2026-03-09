export function showAlerts(errors) {
    const alertsContainer = document.querySelector('.alerts-container');

    // Clear previous alerts
    alertsContainer.innerHTML = '';

    errors.forEach(message => {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert', 'error');
        alertDiv.textContent = message;
        alertsContainer.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    });
}

export function showMessage(container, message){
    container.innerHTML = `
    <div class="no-projects-message">${message}</div>
    `;
}