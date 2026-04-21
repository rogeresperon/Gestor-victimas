(function () {
  // Utilidades generales
  const pad = n => String(n).padStart(2, '0');
  const fmtDDMMYYYY = (d) => `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
  const parseDDMMYYYY = (str) => {
    const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(str);
    if (!m) return null;
    const [ , dd, mm, yyyy ] = m;
    const d = new Date(Number(yyyy), Number(mm)-1, Number(dd));
    // Validación simple
    return (d && d.getMonth() === Number(mm)-1 && d.getDate() === Number(dd)) ? d : null;
  };
  const sameDay = (a,b) => a && b &&
    a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

  // Componente DatePicker reutilizable
  function makeDatepicker(fieldEl, { onSelect, weekStartsOnSunday = true } = {}) {
    const input    = fieldEl.querySelector('input[type="text"]');
    const picker   = fieldEl.querySelector('.datepicker');
    const titleEl  = fieldEl.querySelector('.dp-title');
    const daysGrid = fieldEl.querySelector('.dp-days');
    const btnPrev  = fieldEl.querySelector('.prev');
    const btnNext  = fieldEl.querySelector('.next');
    const iconBtn  = fieldEl.querySelector('.input-icon .icon');

    // Estado interno
    let view = new Date();       // mes/año visible
    let selected = null;         // Date seleccionada
    let minDate = null;          // límites opcionales
    let maxDate = null;

    function setOpen(open) {
      if (!picker) return;
      picker.classList.toggle('open', open);
      input.setAttribute('aria-expanded', String(open));
    }

    function isDisabled(date) {
      if (minDate && date < stripTime(minDate)) return true;
      if (maxDate && date > stripTime(maxDate)) return true;
      return false;
    }

    function stripTime(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

    function updateTitle() {
      const year = view.getFullYear();
      const monthName = view.toLocaleDateString('es-MX', { month: 'long' }); // "septiembre"
      titleEl.textContent = `${monthName} ${year}`; // sin "de"
    }

    function build() {
      if (!picker) return;

      updateTitle();

      const year = view.getFullYear();
      const month = view.getMonth();

      // Primer día del mes
      const firstOfMonth = new Date(year, month, 1);
      // Si la semana inicia el domingo (Do), usamos getDay() directo (0=Do,6=Sa)
      const firstWeekday = weekStartsOnSunday ? firstOfMonth.getDay() : (firstOfMonth.getDay() + 6) % 7;

      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrev  = new Date(year, month, 0).getDate();

      const cells = [];

      // Días visibles del mes anterior
      for (let i = firstWeekday - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, daysInPrev - i);
        cells.push({ date, out: true });
      }

      // Días del mes actual
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        cells.push({ date, out: false });
      }

      // Completar a 42 celdas (6 filas)
      while (cells.length < 42) {
        const index = cells.length - (firstWeekday + daysInMonth);
        const nextDate = new Date(year, month, daysInMonth + index + 1);
        cells.push({ date: nextDate, out: true });
      }

      // Render
      daysGrid.innerHTML = '';
      const today = stripTime(new Date());

      cells.forEach(({date, out}) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dp-day' + (out ? ' out' : '') +
          (sameDay(date, today) ? ' today' : '') +
          (selected && sameDay(date, selected) ? ' selected' : '');

        btn.textContent = date.getDate();
        btn.setAttribute('aria-label', date.toLocaleDateString('es-MX'));
        btn.setAttribute('aria-pressed', selected && sameDay(date, selected) ? 'true' : 'false');

        // Deshabilitar según min/max
        if (isDisabled(date)) {
          btn.disabled = true;
          btn.classList.add('disabled');
        }

        btn.addEventListener('click', () => {
          if (btn.disabled) return;
          selected = stripTime(date);
          input.value = fmtDDMMYYYY(selected);
          build();       // repintar para aplicar .selected
          setOpen(false);
          input.focus();
          onSelect && onSelect(selected);
        });

        daysGrid.appendChild(btn);
      });
    }

    // API pública para sincronizar min/max desde fuera
    function setMinDate(d) { minDate = d ? stripTime(d) : null; build(); }
    function setMaxDate(d) { maxDate = d ? stripTime(d) : null; build(); }
    function getSelected() { return selected ? new Date(selected) : null; }
    function setViewTo(date) {
      view = new Date(date.getFullYear(), date.getMonth(), 1);
      build();
    }

    // Abrir/cerrar
    input.addEventListener('focus', () => setOpen(true));
    input.addEventListener('click', () => setOpen(true));
    if (iconBtn) iconBtn.addEventListener('click', () => setOpen(true));

    document.addEventListener('click', (e) => {
      if (!fieldEl.contains(e.target)) setOpen(false);
    });

    // Navegación
    btnPrev.addEventListener('click', () => {
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
      build();
    });
    btnNext.addEventListener('click', () => {
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      build();
    });

    // Teclado
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') setOpen(!picker.classList.contains('open'));
    });

    // Si el input ya trae valor, sincronizamos selección y vista
    const existing = parseDDMMYYYY(input.value);
    if (existing) {
      selected = existing;
      setViewTo(existing);
    } else {
      build();
    }

    return { setMinDate, setMaxDate, getSelected, setViewTo };
  }

  // ----- Inicializar ambos pickers -----
  const inicioField = document.querySelector('.contDestino__inicio .field');
  const finField    = document.querySelector('.contDestino__fin .field');

  const inicioPicker = makeDatepicker(inicioField, {
    weekStartsOnSunday: true,
    onSelect: (startDate) => {
      // Al elegir inicio, fijamos min en "fin"
      finPicker.setMinDate(startDate);

      // Si ya hay fin y quedó antes que inicio, lo corregimos
      const finSel = finPicker.getSelected();
      if (finSel && finSel < startDate) {
        // mover fin = inicio
        const finInput = finField.querySelector('input[type="text"]');
        finInput.value = `${pad(startDate.getDate())}-${pad(startDate.getMonth()+1)}-${startDate.getFullYear()}`;
        // actualizar selección interna del fin
        finPicker.setViewTo(startDate);
        // No tenemos setter directo de selected; basta con re-abrir y re-seleccionar si quieres.
        // Aquí lo simple es: el usuario vuelve a abrir y el min ya está aplicado.
      }
    }
  });

  const finPicker = makeDatepicker(finField, {
    weekStartsOnSunday: true,
    onSelect: (endDate) => {
      // Si se elige fin menor que inicio, forzamos a que coincida con inicio
      const startSel = inicioPicker.getSelected();
      if (startSel && endDate < startSel) {
        const finInput = finField.querySelector('input[type="text"]');
        finInput.value = fmtDDMMYYYY(startSel);
        finPicker.setViewTo(startSel);
      }
    }
  });

  // Si ya hay una fecha de inicio escrita al cargar, aplicamos min en fin
  const startExisting = parseDDMMYYYY(document.getElementById('fechaInicio').value);
  if (startExisting) {
    finPicker.setMinDate(startExisting);
  }
})();
