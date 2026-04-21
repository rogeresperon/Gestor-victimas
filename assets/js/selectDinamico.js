document.getElementById('documento').addEventListener('change', function() {
  const valor = this.value;
  const contenedor = document.getElementById('campos-documentos');
  
  // Limpiar contenedor
  contenedor.innerHTML = '';
  
  if (valor === 'curp') {
    contenedor.innerHTML = `
      <div class="contBasico__input">
        <div class="contBasico__inputGroup--horizontal">
          <div class="contBasico__inputGroup--item">
            <label class="contBasico__label" for="input-curp">Número de CURP</label>
            <input type="text" class="form-control input__dinamico" id="input-curp" name="curp" placeholder="Ingresa tu CURP" pattern="[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9]{2}">
          </div>
          <button type="button" class="boton__primario">Validar CURP</button>

          <!-- Alerta que solo se visualiza cuando se valida, el boton se oculta -->
          <div class="aviso aviso--verde500 d-none" role="alert">
            <div class="aviso__icon" aria-label="Información:">
              <img src="./assets/icons/aviso__exito.svg" alt="">
            </div>
            <div class="aviso__txt">
              <p>Información validada</p>
            </div>
          </div> 
        </div>
        <div class="aviso aviso--rojo500" role="alert">
          <div class="aviso__icon" aria-label="Información:">
            <img src="./assets/icons/aviso__error.svg" alt="">
          </div>
          <div class="aviso__txt">
            <p>No pudimos validar los datos. Verifica que estén correctos, sin espacios ni símbolos.</p>
          </div>
        </div>  
        <p class="documentos__enlace">¿No conoces tu CURP? <a href="">Consúltala aquí.</a></p>
      </div>
    `;
  }
  else if (valor === 'pasaporte') {
    contenedor.innerHTML = `
    <div class="contBasico__input">
      <div class="contBasico__inputGroup--horizontal">
        <div class="contBasico__inputGroup--item">
          <label class="contBasico__label" for="input-pasaporte">Número de pasaporte</label>
          <input type="text" class="form-control input__dinamico" id="input-pasaporte" name="pasaporte" placeholder="Ingresa los datos" >
        </div>
        <button type="botton" class="boton__primario">Validar documento</button>
        <!-- Alerta que solo se visualiza cuando se valida, el boton se oculta -->
        <div class="aviso aviso--verde500 d-none" role="alert">
          <div class="aviso__icon" aria-label="Información:">
            <img src="./assets/icons/aviso__exito.svg" alt="">
          </div>
          <div class="aviso__txt">
            <p>Información validada</p>
          </div>
        </div> 
      </div>
      <p id="pasaporteTooltip" 
        data-bs-toggle="tooltip" 
        data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Puedes encontrar el número en la parte superior derecha, debajo de la leyenda 'Pasaporte No.' El número suele comenzar con una letra (como G) seguida de 8 dígitos. Asegúrate de ingresarlo tal como aparece, sin espacios ni guiones." class="documentos__enlace">¿Dónde encuentro mi número de pasaporte? </p>
    </div>
    `;
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }
  else if (valor === 'acta') {
    contenedor.innerHTML = `
    <div class="contBasico__input">
      <div class="contBasico__inputGroup--horizontal">
        <div class="contBasico__inputGroup--item">
          <label class="contBasico__label" for="input-acta">Número de acta</label>
          <input type="text" class="form-control input__dinamico" id="input-acta" name="acta" placeholder="Ingresa tu número de acta Ej.: 0012345">
        </div>
      </div>
    </div>
    <div class="contBasico__input">
      <div class="contBasico__inputGroup--horizontal">
        <div class="contBasico__inputGroup--item">
          <label class="contBasico__label" for="input-fechaActa">Fecha de registro del acta</label>
          <input type="date" class="form-control input__dinamico" id="input-fechaActa" name="fechaActa" placeholder="Ingresa tu número de acta Ej.: 21/02/1986">
        </div>
      </div>
    </div>
    <div class="contBasico__input">
      <div class="contBasico__inputGroup--horizontal">
        <div class="contBasico__inputGroup--item">
          <label class="contBasico__label" for="input-registro">Número de oficialía donde fue registrada</label>
          <input type="text" class="form-control input__dinamico" id="input-registro" name="registro" placeholder="Ingresa tu número de acta Ej.: 013">
        </div>
      </div>
      <p id="actaTooltip" 
         data-bs-toggle="tooltip" 
         data-bs-placement="bottom"
         data-bs-custom-class="custom-tooltip custom-tooltip-list"
         data-bs-html="true"
         class="documentos__enlace">¿Dónde encuentro los datos en mi acta?</p>
    </div>
    <div class="grupo__aviso">
      <button type="button" class="boton__primario">Validar datos</button>
    </div>
    <!-- Alerta que solo se visualiza cuando se valida, el boton se oculta -->
        <div class="aviso aviso--verde500 d-none" role="alert">
          <div class="aviso__icon" aria-label="Información:">
            <img src="./assets/icons/aviso__exito.svg" alt="">
          </div>
          <div class="aviso__txt">
            <p>Información validada</p>
          </div>
        </div> 
    `;
    
    // Configurar el contenido del tooltip
    const tooltipContent = `
      <div class="tooltip-list-container">
        <p>Encuentra estos datos en la parte superior del acta de nacimiento.</p>
        <ul class="tooltip-list">
          <li class="txt__li">Número de acta: <span>aparece junto a la clave de entidad y el año.</span></li>
          <li class="txt__li">Fecha de registro: <span>es la fecha en que se asentó el acta.</span></li>
          <li class="txt__li">Oficialía: <span>es el número del Registro Civil donde se expidió tu acta.</span></li>
        </ul>
      </div>
    `;
    
    // Inicializar tooltip después de que el DOM se actualice
    setTimeout(() => {
      const actaTooltip = document.getElementById('actaTooltip');
      if (actaTooltip) {
        actaTooltip.setAttribute('data-bs-title', tooltipContent);
        new bootstrap.Tooltip(actaTooltip, {
          html: true,
          boundary: document.body
        });
      }
    }, 0);
  }
});