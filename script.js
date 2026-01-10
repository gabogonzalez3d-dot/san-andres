console.log("JS cargado correctamente");

/* =====================
   MENÚ HAMBURGUESA
===================== */

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });

  document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
    });
  });
}

/* =====================
   LIGHTBOX (SLIDESHOW)
===================== */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-nav.prev");
const lightboxNext = document.querySelector(".lightbox-nav.next");
const lightboxCounter = document.querySelector(".lightbox-counter");

/* Lista de imágenes de la carpeta ubicacion (orden deseado) */
const ubicacionImages = [
  "images/ubicacion/aerea-01.jpg",
  "images/ubicacion/aerea-02.jpg",
  "images/ubicacion/aerea-03.jpg",
  "images/ubicacion/mapa.jpg"
];

let currentIndex = 0;

function openLightbox(index) {
  if (!lightbox || !lightboxImg) return;
  currentIndex = (index + ubicacionImages.length) % ubicacionImages.length;
  lightboxImg.src = ubicacionImages[currentIndex];
  updateCounter();
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

function showNext() {
  openLightbox(currentIndex + 1);
}

function showPrev() {
  openLightbox(currentIndex - 1);
}

function updateCounter() {
  if (!lightboxCounter) return;
  lightboxCounter.textContent = `${currentIndex + 1} / ${ubicacionImages.length}`;
}

/* Abrir slideshow al hacer click sobre el mapa */
const mapImg = document.querySelector('.map img');
if (mapImg) {
  mapImg.addEventListener('click', () => {
    // abrir en la posición correspondiente (mapa.jpg)
    const idx = ubicacionImages.indexOf(mapImg.src.replace(location.origin + '/', ''));
    // Fallback: buscar por nombre de archivo
    const nameIdx = ubicacionImages.findIndex(s => s.endsWith('mapa.jpg'));
    openLightbox(nameIdx >= 0 ? nameIdx : 0);
  });
}

/* También permitir abrir desde cualquier thumbnail existente */
document.querySelectorAll('.location-gallery img, .location-gallery .lightbox-item').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const src = thumb.src;
    // Encontrar índice por coincidencia de nombre de archivo
    const idx = ubicacionImages.findIndex(s => src.endsWith(s.split('/').pop()));
    openLightbox(idx >= 0 ? idx : 0);
  });
});

/* Botones prev/next */
if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

/* Cerrar con botón */
if (lightboxClose && lightbox) {
  lightboxClose.addEventListener("click", () => {
    closeLightbox();
  });
}

/* Cerrar clickeando fondo (no cerrar cuando se clickea en img o botones) */
if (lightbox) {
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

/* Navegación por teclado (ESC, flechas) */
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowRight') {
    showNext();
  } else if (e.key === 'ArrowLeft') {
    showPrev();
  }
});
