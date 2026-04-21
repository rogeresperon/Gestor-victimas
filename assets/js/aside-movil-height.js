// Detecta la altura entre menuMain y el borde superior de la ventana
// Luego se lo aplica al menú desplegable menuMovil
function ajustarAlturaMenuMovil() {
    const menuMain = document.getElementById('menuMain');
    const menuMovil = document.querySelector('.menuMovil');

    if (!menuMain || !menuMovil) return;

    // Distancia desde el top de la ventana hasta el top de #menuMain
    const distanciaSuperior = menuMain.getBoundingClientRect().top;

    // Asignar esa distancia como altura del div.menuMovil
    menuMovil.style.height = distanciaSuperior + 'px';
}

// Ejecutar cuando cargue la página
window.addEventListener('load', ajustarAlturaMenuMovil);

// Recalcular al redimensionar la ventana
window.addEventListener('resize', ajustarAlturaMenuMovil);

// (Opcional) Si puede moverse al hacer scroll:
window.addEventListener('scroll', ajustarAlturaMenuMovil);
