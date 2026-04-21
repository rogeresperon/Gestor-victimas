function configurarToggle(gatillo, menu, clase) {
  if (!gatillo || !menu) return;

  gatillo.addEventListener('click', () => {
    const isExpanded = gatillo.getAttribute('aria-expanded') === 'true';
    gatillo.setAttribute('aria-expanded', String(!isExpanded));
    menu.classList.toggle(clase);
  });
}

// ---- Menú desktop ----
configurarToggle(
  document.getElementById('menuMain__gatillo'),
  document.getElementById('menuMain'),
  'menuMain--colapsado'
);

// ---- Menú móvil ----
const menuMovil = document.getElementById('menuMovil');

configurarToggle(
  document.getElementById('menuMovil__gatillo'),
  menuMovil,
  'menuMovil--colapsado'
);

configurarToggle(
  document.getElementById('menuMovil__gatilloTop'),
  menuMovil,
  'menuMovil--colapsado'
);
