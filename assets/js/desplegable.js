document.addEventListener('DOMContentLoaded', function () {
        const menuItems = document.querySelectorAll('.filtro-menu > li');

        menuItems.forEach(item => {
            item.addEventListener('click', function (event) {
                // Previene el comportamiento por defecto del enlace, si lo hubiera
                event.stopPropagation();

                const submenu = this.querySelector('.submenu');

                // Cierra otros submenús abiertos
                document.querySelectorAll('.submenu').forEach(sub => {
                    if (sub !== submenu) {
                        sub.style.display = 'none';
                    }
                });

                // Alterna la visibilidad del submenú actual
                if (submenu) {
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        });

        // Cierra el menú si se hace clic fuera de él
        document.addEventListener('click', function () {
            document.querySelectorAll('.submenu').forEach(sub => {
                sub.style.display = 'none';
            });
        });
    });