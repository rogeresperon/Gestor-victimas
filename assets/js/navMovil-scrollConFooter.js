document.addEventListener("DOMContentLoaded", () => {

    const nav = document.querySelector(".navMain");
    const footer = document.querySelector(".footer");
    if (!nav || !footer) return;

    const mq = window.matchMedia("(max-width: 767.9px)");

    // Función que ajusta el bottom SOLO en móvil
    const updateBottom = () => {
        if (!mq.matches) return; // no hacer nada fuera de móvil

        const rect = footer.getBoundingClientRect();
        const vh = window.innerHeight;

        // Calcular pixeles visibles del footer
        if (rect.top < vh && rect.bottom > 0) {
            const visible = Math.min(vh, rect.bottom) - Math.max(0, rect.top);
            nav.style.bottom = visible + "px";
        } else {
            nav.style.bottom = ""; // limpiar si no entra
        }
    };

    // Observer para detectar entrada/salida del footer SOLO si es móvil
    const observer = new IntersectionObserver(
        () => updateBottom(),
        { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    );

    // Activar/Desactivar según el tamaño
    const handleMediaChange = e => {
        if (e.matches) {
            // Ahora estamos en móvil → observar y controlar
            observer.observe(footer);
        } else {
            // Ahora estamos en > 768px → limpiar y dejar de observar
            observer.unobserve(footer);
            nav.style.bottom = ""; // evita escribir style="bottom:0px"
        }
    };

    // Inicialización clásica
    handleMediaChange(mq);

    // Escuchar cambio de breakpoint en tiempo real
    mq.addEventListener("change", handleMediaChange);

});