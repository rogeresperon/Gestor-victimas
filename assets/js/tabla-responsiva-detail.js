(() => {
  const componentes = document.querySelectorAll('.js-tablaComponenteEspecial');

  if (!componentes.length) return;

  let backdrop = document.querySelector('.tablaComponenteEspecial__backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'tablaComponenteEspecial__backdrop';
    document.body.appendChild(backdrop);
  }

  function posicionarMenu(detail) {
    const summary = detail.querySelector('.tablaComponenteEspecial__summary');
    const menu = detail.querySelector('.tablaComponenteEspecial__lista');

    if (!summary || !menu || !detail.open) return;

    const btnRect = summary.getBoundingClientRect();
    const espacio = 8;

    menu.style.visibility = 'hidden';
    menu.style.display = 'block';
    menu.style.top = '0px';
    menu.style.left = '0px';
    menu.style.right = 'auto';
    menu.style.bottom = 'auto';

    const menuRect = menu.getBoundingClientRect();

    let top = btnRect.bottom + espacio;
    let left = btnRect.right - menuRect.width;

    if (left < espacio) {
      left = espacio;
    }

    if (left + menuRect.width > window.innerWidth - espacio) {
      left = window.innerWidth - menuRect.width - espacio;
    }

    if (top + menuRect.height > window.innerHeight - espacio) {
      top = btnRect.top - menuRect.height - espacio;
    }

    if (top < espacio) {
      top = espacio;
    }

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.right = 'auto';
    menu.style.bottom = 'auto';
    menu.style.visibility = 'visible';
  }

  function cerrarTodosLosMenus() {
    document.querySelectorAll('.js-tablaComponenteEspecialMenu[open]').forEach((detail) => {
      detail.removeAttribute('open');
    });

    backdrop.classList.remove('activo');
  }

  function reposicionarMenusAbiertos() {
    document.querySelectorAll('.js-tablaComponenteEspecialMenu[open]').forEach((detail) => {
      posicionarMenu(detail);
    });
  }

  componentes.forEach((componente) => {
    const contenedor = componente.querySelector('.tablaResponsiva--horizontal');
    const celdasFijas = componente.querySelectorAll('.tablaComponenteEspecial__colFija');
    const menus = componente.querySelectorAll('.js-tablaComponenteEspecialMenu');

    if (contenedor) {
      const actualizarSombra = () => {
        const tieneScroll = contenedor.scrollLeft > 0;

        celdasFijas.forEach((celda) => {
          celda.classList.toggle('tablaComponenteEspecial__colFija--sombreado', tieneScroll);
        });
      };

      contenedor.addEventListener('scroll', () => {
        actualizarSombra();
        reposicionarMenusAbiertos();
      });

      actualizarSombra();
    }

    menus.forEach((detailActual) => {
      detailActual.addEventListener('toggle', () => {
        if (detailActual.open) {
          document.querySelectorAll('.js-tablaComponenteEspecialMenu').forEach((otroDetail) => {
            if (otroDetail !== detailActual) {
              otroDetail.removeAttribute('open');
            }
          });

          backdrop.classList.add('activo');
          posicionarMenu(detailActual);
        } else {
          const hayOtroAbierto = document.querySelector('.js-tablaComponenteEspecialMenu[open]');
          if (!hayOtroAbierto) {
            backdrop.classList.remove('activo');
          }
        }
      });
    });
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.js-tablaComponenteEspecialMenu[open]').forEach((detail) => {
      if (!detail.contains(event.target)) {
        detail.removeAttribute('open');
      }
    });

    const hayOtroAbierto = document.querySelector('.js-tablaComponenteEspecialMenu[open]');
    if (!hayOtroAbierto) {
      backdrop.classList.remove('activo');
    }
  });

  backdrop.addEventListener('click', () => {
    cerrarTodosLosMenus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      cerrarTodosLosMenus();
    }
  });

  window.addEventListener('resize', reposicionarMenusAbiertos);
  window.addEventListener('scroll', reposicionarMenusAbiertos, true);
})();