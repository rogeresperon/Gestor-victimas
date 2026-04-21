// En escritorio (min 768px)
// mantiene abierto [OPEN] los DETAILS con class="details__deskOpen" 
// y el SUMMARY lo cambia a DISPLAY:NONE

function toggleDetailsOpenAttribute() {
    const detailsElements = document.querySelectorAll("details.details__deskOpen");

    if (window.innerWidth < 768) {
        // MÓVIL: cerrar details y mostrar summary
        detailsElements.forEach((details) => {
            details.removeAttribute("open");
            const summary = details.querySelector("summary");
            if (summary) summary.style.display = "";
        });
    } else {
        // ESCRITORIO: abrir details y ocultar summary
        detailsElements.forEach((details) => {
            details.setAttribute("open", "");
            const summary = details.querySelector("summary");
            if (summary) summary.style.display = "none";
        });
    }
}

// Ejecutar al cargar la página
window.addEventListener("load", toggleDetailsOpenAttribute);
// Aplicar al redimensionar la página
window.addEventListener("resize", toggleDetailsOpenAttribute);
