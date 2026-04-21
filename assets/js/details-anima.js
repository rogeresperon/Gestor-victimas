// Aniam la apertura y cierre de DETAILS
// EL contenido requiere class="details__caja"
document.querySelectorAll("details").forEach(det => {
    const summary = det.querySelector("summary");
    const caja = det.querySelector(".details__caja");

    if (!summary || !caja) return;

    // Interceptar el comportamiento nativo
    summary.addEventListener("click", (ev) => {
        ev.preventDefault(); // evita el toggle instantáneo

        if (!det.open) {
            abrir(det, caja);
        } else {
            cerrar(det, caja);
        }
    });
});

function abrir(det, caja) {
    // Preparar
    caja.style.height = "auto";
    const alto = caja.offsetHeight + "px";
    caja.style.height = "0px";
    det.open = true; // abrir manualmente

    requestAnimationFrame(() => {
        caja.style.height = alto;
    });

    caja.addEventListener("transitionend", function fin() {
        caja.style.height = "auto";
        caja.removeEventListener("transitionend", fin);
    });
}

function cerrar(det, caja) {
    const alto = caja.offsetHeight + "px";
    caja.style.height = alto;

    requestAnimationFrame(() => {
        caja.style.height = "0px";
    });

    caja.addEventListener("transitionend", function fin() {
        det.open = false; // cerrar manualmente después de animar
        caja.removeEventListener("transitionend", fin);
    });
}