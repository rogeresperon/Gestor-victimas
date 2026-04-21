document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.filtro-menu--concept, .customdate').forEach(contenedor => {
        const header = contenedor.querySelector('.dateSelected, .filtro-menu--concept');
        if (header) {
            contenedor.dataset.originalText = header.textContent.trim();
        }
    });

    window.HOY = new Date();
    window.HOY.setHours(0, 0, 0, 0);
    window.RANGO_MINIMO = new Date(1970, 0, 1);
    window.RANGO_MAXIMO = window.HOY;

    // ─────────────────────────────────────────────
    // UTILIDADES
    // ─────────────────────────────────────────────
    function repositionarMenu(menu) {
        if (!menu) return;
        menu.style.right = '';
        menu.style.left = '';
        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        if (rect.right > viewportWidth) {
            menu.style.right = '0';
            menu.style.left = 'auto';
        }
        if (rect.left < 0) {
            menu.style.left = '0';
            menu.style.right = 'auto';
        }
    }

    function cerrarTodosLosMenus(excepto) {
        document.querySelectorAll('.boxSelector, .submenu').forEach(m => {
            if (m !== excepto) {
                m.classList.add('d-none');
                const contenedor = m.closest('.filtro-item-contenedor, .customdate');
                const header = contenedor?.querySelector('.filtro-menu--concept, .dateSelected');
                if (header) header.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function abrirMenu(menu, header) {
        menu.classList.remove('d-none');
        header?.setAttribute('aria-expanded', 'true');
        repositionarMenu(menu);
    }

    function cerrarMenu(menu, header) {
        menu.classList.add('d-none');
        header?.setAttribute('aria-expanded', 'false');
        header?.focus();
    }

    function trapFocus(menu, header, e) {
        const focusables = Array.from(menu.querySelectorAll('button, input, [tabindex="0"]'));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                cerrarMenu(menu, header);
            } else if (!e.shiftKey && document.activeElement === last) {
                cerrarMenu(menu, header);
            }
        }
    }

    // ─────────────────────────────────────────────
    // DATEPICKER
    // ─────────────────────────────────────────────
    function initDatepicker(calendarContainer) {
        if (!calendarContainer) return;

        const rangeSelected = { start: null, end: null };
        let currentDisplayDate = new Date(window.HOY.getFullYear(), window.HOY.getMonth(), 1);

        const boxSelector      = calendarContainer.querySelector('.boxSelector');
        const dateStartElement = calendarContainer.querySelector('.dateSelected');
        const gridDias1        = calendarContainer.querySelector('.grid-dias-1');
        const arrowLeft        = calendarContainer.querySelector('.infoNavegacion .iconBox:first-child');
        const arrowRight       = calendarContainer.querySelector('.infoNavegacion .iconBox:last-child');
        const mesDisplay1      = calendarContainer.querySelector('.mes-display-1');
        const anioDisplay1     = calendarContainer.querySelector('.anio-display-1');
        const textoOriginal    = calendarContainer.dataset.originalText || dateStartElement?.textContent.trim();

        if (!gridDias1) return;

        [arrowLeft, arrowRight].forEach(arrow => {
            if (!arrow) return;
            arrow.tabIndex = 0;
            arrow.setAttribute('role', 'button');
            arrow.style.cursor = 'pointer';
            arrow.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    arrow.click();
                    setTimeout(() => arrow.focus(), 10);
                }
            });
        });

        function createDateFromDataset(el) {
            return new Date(parseInt(el.dataset.anio), parseInt(el.dataset.mes), parseInt(el.dataset.dia));
        }

        function updateDateDisplays() {
            if (!dateStartElement) return;
            if (rangeSelected.start) {
                const start = rangeSelected.start.toLocaleDateString();
                const end = rangeSelected.end ? ` - ${rangeSelected.end.toLocaleDateString()}` : '';
                dateStartElement.textContent = start + end;
                dateStartElement.classList.add('active');
            } else {
                dateStartElement.textContent = textoOriginal;
                dateStartElement.classList.remove('active');
            }
        }

        function limpiarRango() {
            rangeSelected.start = null;
            rangeSelected.end = null;
            calendarContainer.querySelectorAll('.dia').forEach(d =>
                d.classList.remove('selected', 'range', 'start-date', 'end-date')
            );
            updateDateDisplays();
        }

        function applyRangeVisuals() {
            const todosLosDias = gridDias1.querySelectorAll('.dia');
            todosLosDias.forEach(dia => {
                dia.classList.remove('selected', 'range', 'start-date', 'end-date');
            });
            if (!rangeSelected.start) return;
            todosLosDias.forEach(diaElement => {
                const fechaDia = createDateFromDataset(diaElement);
                const tiempoDia = fechaDia.getTime();
                if (rangeSelected.start && tiempoDia === rangeSelected.start.getTime()) {
                    diaElement.classList.add('selected', 'start-date');
                }
                if (rangeSelected.end && tiempoDia === rangeSelected.end.getTime()) {
                    diaElement.classList.add('selected', 'end-date');
                }
                if (rangeSelected.start && rangeSelected.end &&
                    tiempoDia > rangeSelected.start.getTime() &&
                    tiempoDia < rangeSelected.end.getTime()) {
                    diaElement.classList.add('range');
                }
            });
        }

        function generarDiasEnHTML(anio, mes, gridDiasContainer) {
            if (!gridDiasContainer) return;
            gridDiasContainer.innerHTML = '';
            const primerDia = new Date(anio, mes, 1).getDay();
            const diasEnMes = new Date(anio, mes + 1, 0).getDate();
            const desfase = primerDia === 0 ? 6 : primerDia - 1;

            for (let i = 0; i < desfase; i++) {
                const span = document.createElement('span');
                span.classList.add('vacio');
                gridDiasContainer.appendChild(span);
            }

            for (let d = 1; d <= diasEnMes; d++) {
                const span = document.createElement('span');
                span.classList.add('dia');
                span.setAttribute('tabindex', '0');
                span.setAttribute('role', 'button');
                span.setAttribute('aria-label', `Día ${d}`);
                span.dataset.dia = d;
                span.dataset.mes = mes;
                span.dataset.anio = anio;
                span.textContent = d;

                span.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        span.click();
                    }
                    if (e.key === 'Escape') {
                        cerrarMenu(boxSelector, dateStartElement);
                    }
                });

                gridDiasContainer.appendChild(span);
            }
        }

        function actualizarVistaCalendario(anio, mes) {
            const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
            if (mesDisplay1) mesDisplay1.textContent = meses[mes];
            if (anioDisplay1) anioDisplay1.textContent = anio;
            generarDiasEnHTML(anio, mes, gridDias1);
            applyRangeVisuals();
        }

        if (boxSelector) {
            boxSelector.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    cerrarMenu(boxSelector, dateStartElement);
                }
                trapFocus(boxSelector, dateStartElement, e);
            });
        }

        gridDias1.addEventListener('click', (e) => {
            const diaElement = e.target.closest('.dia');
            if (!diaElement || diaElement.classList.contains('vacio')) return;

            const seleccionada = createDateFromDataset(diaElement);

            if (!rangeSelected.start || rangeSelected.end) {
                rangeSelected.start = seleccionada;
                rangeSelected.end = null;
            } else {
                if (seleccionada < rangeSelected.start) {
                    rangeSelected.end = rangeSelected.start;
                    rangeSelected.start = seleccionada;
                } else {
                    rangeSelected.end = seleccionada;
                }
            }

            const liPadre = calendarContainer.closest('li');
            if (rangeSelected.start !== null && liPadre) {
                liPadre.classList.add('filtro-activo');
            }

            updateDateDisplays();
            applyRangeVisuals();
            actualizarEstadoBotonLimpiar();
        });

        if (arrowLeft) {
            arrowLeft.addEventListener('click', (e) => {
                e.stopPropagation();
                currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
                actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
            });
        }

        if (arrowRight) {
            arrowRight.addEventListener('click', (e) => {
                e.stopPropagation();
                currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
                actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
            });
        }

        const btnReset = calendarContainer.querySelector('.reset');
        if (btnReset) {
            btnReset.addEventListener('click', (e) => {
                e.stopPropagation();
                limpiarRango();
                const liPadre = calendarContainer.closest('li');
                if (liPadre) liPadre.classList.remove('filtro-activo');
                actualizarEstadoBotonLimpiar();
            });
        }

        if (dateStartElement) {
            dateStartElement.tabIndex = 0;
            dateStartElement.setAttribute('role', 'button');
            dateStartElement.setAttribute('aria-expanded', 'false');

            dateStartElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dateStartElement.click();
                }
            });

            dateStartElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const estaCerrado = boxSelector.classList.contains('d-none');
                cerrarTodosLosMenus(estaCerrado ? boxSelector : null);

                if (estaCerrado) {
                    abrirMenu(boxSelector, dateStartElement);
                    actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
                    setTimeout(() => arrowLeft?.focus(), 100);
                } else {
                    cerrarMenu(boxSelector, dateStartElement);
                }
            });
        }

        updateDateDisplays();
        actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
    }

    document.querySelectorAll('.customdate.date-start').forEach(initDatepicker);

    // ─────────────────────────────────────────────
    // FILTROS CON CHECKBOXES
    // ─────────────────────────────────────────────
    function actualizarEstadoBotonLimpiar() {
        const btnBorrarTodo = document.getElementById('btnBorrarTodo');
        if (!btnBorrarTodo) return;
        const hayChecks = Array.from(document.querySelectorAll('.form__checkbox')).some(c => c.checked);
        if (hayChecks) {
            btnBorrarTodo.classList.remove('btn-disabled');
        } else {
            btnBorrarTodo.classList.add('btn-disabled');
        }
    }

    function actualizarEstadoFiltro(contenedor) {
        const header = contenedor.querySelector('.filtro-menu--concept');
        const checks = contenedor.querySelectorAll('.form__checkbox');
        const textoOriginal = contenedor.dataset.originalText;

        const seleccionados = Array.from(checks)
            .filter(c => c.checked)
            .map(c => c.closest('label').textContent.trim());

        if (header) {
            if (seleccionados.length > 0) {
                header.textContent = seleccionados.join(', ');
                header.classList.add('active');
                contenedor.classList.add('filtro-activo');
            } else {
                header.textContent = textoOriginal;
                header.classList.remove('active');
                contenedor.classList.remove('filtro-activo');
            }
        }
    }

    function limpiarFiltroIndividual(contenedor) {
        const header = contenedor.querySelector('.dateSelected, .filtro-menu--concept');
        const checks = contenedor.querySelectorAll('.form__checkbox');
        const liPadre = contenedor.closest('li');
        const textoOriginal = contenedor.dataset.originalText;

        checks.forEach(c => c.checked = false);

        if (header) {
            header.textContent = textoOriginal;
            header.classList.remove('active');
            header.setAttribute('aria-expanded', 'false');
        }

        if (liPadre) liPadre.classList.remove('filtro-activo');

        actualizarEstadoBotonLimpiar();
    }

    document.querySelectorAll('.filtro-menu--concept-container').forEach(contenedor => {
        const header   = contenedor.querySelector('.filtro-menu--concept');
        const checks   = contenedor.querySelectorAll('.form__checkbox');
        const menu     = contenedor.querySelector('.submenu, .boxSelector');
        const btnReset = contenedor.querySelector('.reset');

        if (!contenedor.dataset.originalText && header) {
            contenedor.dataset.originalText = header.textContent.trim();
        }

        if (header) {
            header.tabIndex = 0;
            header.setAttribute('aria-expanded', 'false');

            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });

            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const estaCerrado = menu?.classList.contains('d-none');
                cerrarTodosLosMenus(estaCerrado ? menu : null);

                if (menu) {
                    if (estaCerrado) {
                        abrirMenu(menu, header);
                        const primerCheck = menu.querySelector('input');
                        setTimeout(() => primerCheck?.focus(), 100);
                    } else {
                        cerrarMenu(menu, header);
                    }
                }
            });
        }

        if (menu) {
            menu.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    cerrarMenu(menu, header);
                }
                trapFocus(menu, header, e);
            });
        }

        checks.forEach(check => {
            check.addEventListener('change', () => {
                actualizarEstadoFiltro(contenedor);
                actualizarEstadoBotonLimpiar();
            });
        });

        if (btnReset) {
            btnReset.addEventListener('click', (e) => {
                e.stopPropagation();
                limpiarFiltroIndividual(contenedor);
            });
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.customdate') && !e.target.closest('.filtro-item-contenedor')) {
            document.querySelectorAll('.boxSelector, .submenu').forEach(m => {
                if (!m.classList.contains('d-none')) {
                    const contenedor = m.closest('.filtro-item-contenedor, .customdate');
                    const header = contenedor?.querySelector('.filtro-menu--concept, .dateSelected');
                    m.classList.add('d-none');
                    header?.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });

    const btnBorrarTodo = document.getElementById('btnBorrarTodo');
    if (btnBorrarTodo) {
        btnBorrarTodo.addEventListener('click', () => {
            document.querySelectorAll('.filtro-menu--concept-container').forEach(limpiarFiltroIndividual);
        });
    }

    const filtrosDiv = document.querySelector('.filtros');
    const toggleBtn  = document.getElementById('toggleFiltrosBtn');
    const closeBtn   = document.querySelector('.close-filtros-btn');

    if (toggleBtn && filtrosDiv) {
        toggleBtn.addEventListener('click', function () {
            const isOpen = filtrosDiv.classList.toggle('open');
            toggleBtn.classList.toggle('active');
            toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            const toggleArrowIcon = toggleBtn.querySelector('.arrow-icon');
            if (toggleArrowIcon) toggleArrowIcon.textContent = isOpen ? '▲' : '▼';
            if (isOpen) {
                const primerHeader = filtrosDiv.querySelector('.filtro-menu--concept, .dateSelected');
                setTimeout(() => primerHeader?.focus(), 300);
            }
        });
    }

    if (closeBtn && filtrosDiv) {
        closeBtn.addEventListener('click', function () {
            filtrosDiv.classList.remove('open');
            toggleBtn?.classList.remove('active');
            toggleBtn?.setAttribute('aria-expanded', 'false');
            const toggleArrowIcon = toggleBtn?.querySelector('.arrow-icon');
            if (toggleArrowIcon) toggleArrowIcon.textContent = '▼';
            toggleBtn?.focus();
        });
    }

    actualizarEstadoBotonLimpiar();
});