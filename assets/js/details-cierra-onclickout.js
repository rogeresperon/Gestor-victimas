document.addEventListener('click', function (event) {
    // Busca todos los <details> con la clase "detailsClickOut"
    document.querySelectorAll('details.detailsClickOut[open]').forEach(details => {
        // Si el clic NO ocurrió dentro del <details>, se cierra
        if (!details.contains(event.target)) {
            details.removeAttribute('open')
        }
    });
});