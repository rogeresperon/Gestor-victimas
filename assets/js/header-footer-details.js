// Agrega OPEN al tag DETAILS en header y footer

function toggleDetailsOpenAttribute() {
    const detailsElements = document.querySelectorAll(
        "details.mexico__details"
    );
    if (window.innerWidth < 768) {
        detailsElements.forEach((details) => details.removeAttribute("open"));
    } else {
        detailsElements.forEach((details) =>
            details.setAttribute("open", "")
        );
    }
}
// Ejecutar al cargar la página
window.addEventListener("load", toggleDetailsOpenAttribute);
// Aplicar al redimensionar la página
window.addEventListener("resize", toggleDetailsOpenAttribute);