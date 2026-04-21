document.addEventListener("DOMContentLoaded", () => {
  const radios = document.querySelectorAll('input[name="area"]');
  const panels = document.querySelectorAll("[data-textarea]");

  function hideAll() {
    panels.forEach(p => p.classList.add("d-none"));
  }

  function showTarget(id) {
    hideAll();
    const el = document.getElementById(id);
    if (el) el.classList.remove("d-none");
  }

  // Mostrar el panel del radio marcado al cargar
  const checked = document.querySelector('input[name="area"]:checked');
  if (checked && checked.dataset.target) {
    showTarget(checked.dataset.target);
  }

  // Cambiar al seleccionar otro radio
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.checked && radio.dataset.target) {
        showTarget(radio.dataset.target);
      }
    });
  });
});
