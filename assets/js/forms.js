document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar todos los íconos y campos de contraseña
  const iconosPass = document.querySelectorAll(".img__pass");
  const passFields = {
    pass: document.getElementById("form__pass"),
    confirmPass: document.getElementById("form__pass--confirm")
  };

  // Verificar que los elementos existen
  if (!iconosPass.length || !passFields.pass || !passFields.confirmPass) {
    console.error("Elementos no encontrados");
    return;
  }

  // Agregar evento a cada ícono
  iconosPass.forEach((icono, index) => {
    icono.addEventListener("click", (e) => {
      // Determinar qué campo de contraseña corresponde a este ícono
      const field = index === 0 ? passFields.pass : passFields.confirmPass;
      
      // Cambiar tipo de input
      const isPassword = field.type === "password";
      field.type = isPassword ? "text" : "password";
      
      // Cambiar el ícono
      icono.src = isPassword 
        ? "./assets/icons/ojo__pass__visible.svg" 
        : "./assets/icons/ojo__pass__oculto.svg";
      
      // Opcional: cambiar el atributo alt para accesibilidad
      icono.alt = isPassword 
        ? "Ocultar contraseña" 
        : "Mostrar contraseña";
    });
  });
});