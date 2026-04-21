document.querySelectorAll('.abrir-dialog').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const dialogId = button.getAttribute('data-dialog');
        const dialog = document.getElementById(dialogId);
        if (dialog) {
            dialog.showModal(); 
        }
    });
});

document.querySelectorAll('.dialog__cerrar').forEach(button => {
    button.addEventListener('click', () => {
        const dialog = button.closest('dialog');
        if (dialog) {
            dialog.close(); 
        }
    });
});