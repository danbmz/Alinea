export function showModal(message, type, location = '/', buttonText = 'Cerrar') {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', type);

    const messagePara = document.createElement('p');
    messagePara.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = buttonText;
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
        document.body.classList.remove('no-scroll');
        window.location.href = location;
    });

    modalContent.appendChild(messagePara);
    modalContent.appendChild(closeButton);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    document.body.classList.add('no-scroll');
}