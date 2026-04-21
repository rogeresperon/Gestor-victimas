  // Toma la mayor altura de los <div class="form__header"> nietos de <div class="fila--X"> 
  // y se la asigna a todos los <div class="form__header"> nietos del <div class="fila--X"> correspondiente

document.addEventListener("DOMContentLoaded", () => {
  // Pequeño debounce para optimizar rendimiento
  const debounce = (fn, wait = 30) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  function ajustarHeaders() {
    const ancho = window.innerWidth;
    const filas = document.querySelectorAll('div[class*="fila--"]');

    filas.forEach(fila => {
      const headers = fila.querySelectorAll('.form__grupo .form__header');
      if (!headers.length) return;

      // Siempre limpiar alturas antes de aplicar cambios
      headers.forEach(h => h.style.height = '');

      if (ancho <= 768) {
        // En resoluciones pequeñas, dejar altura natural
        return;
      }

      // Calcular y aplicar altura máxima solo en >768px
      const maxAltura = Math.max(...Array.from(headers).map(h => h.offsetHeight));
      headers.forEach(h => h.style.height = `${maxAltura}px`);
    });
  }

  const ajustarDebounced = debounce(ajustarHeaders, 120);

  // Ejecutar al cargar
  ajustarHeaders();
  window.addEventListener('load', ajustarDebounced);
  window.addEventListener('resize', ajustarDebounced);
  window.addEventListener('orientationchange', ajustarDebounced);

  // Observa cambios de tamaño o estructura dentro de cada fila
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(ajustarDebounced);
    document.querySelectorAll('div[class*="fila--"]').forEach(fila => ro.observe(fila));
  } else {
    const mo = new MutationObserver(ajustarDebounced);
    document.querySelectorAll('div[class*="fila--"]').forEach(fila =>
      mo.observe(fila, { childList: true, subtree: true, characterData: true })
    );
  }
});