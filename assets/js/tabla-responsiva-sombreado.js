const contenedor = document.querySelector('.tablaResponsiva--horizontal');
const ths = document.querySelectorAll('.tablaResponsiva__colFija');

contenedor.addEventListener('scroll', () => {
  if (contenedor.scrollLeft > 0) {
    ths.forEach(th => th.classList.add('colFija--sombreado'));
  } else {
    ths.forEach(th => th.classList.remove('colFija--sombreado'));
  }
});

const slider = document.getElementById('scroll-container');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
  slider.style.cursor = 'grabbing'; // Cambia el cursor al agarrar
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.style.cursor = 'grab';
});

slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.style.cursor = 'grab';
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; // El '2' multiplica la velocidad
  slider.scrollLeft = scrollLeft - walk;
});