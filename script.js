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

// Los thumbnails específicos de la galería usan '.gallery-thumb' y abren la galería dedicada; el mapa tiene su propio handler.

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

/* =====================
   GALERÍA DE 6 IMAGENES (AUTO-SLIDE SOLO CUANDO ESTÁ ABIERTA)
===================== */

const galleryImages = [
  "images/ubicacion/vg1.jpg",
  "images/ubicacion/vg2.jpg",
  "images/ubicacion/lr1.jpg",
  "images/ubicacion/lr2.jpg",
  "images/ubicacion/en1.jpg",
  "images/ubicacion/en2.jpg"
];

const galleryLightbox = document.getElementById("galleryLightbox");
const galleryImg = galleryLightbox ? galleryLightbox.querySelector(".lightbox-img") : null;
const galleryClose = galleryLightbox ? galleryLightbox.querySelector(".lightbox-close") : null;
const galleryPrev = galleryLightbox ? galleryLightbox.querySelector(".lightbox-nav.prev") : null;
const galleryNext = galleryLightbox ? galleryLightbox.querySelector(".lightbox-nav.next") : null;
const galleryCounter = galleryLightbox ? galleryLightbox.querySelector(".lightbox-counter") : null;

let currentGalleryIndex = 0;
let galleryTimer = null;
const GALLERY_INTERVAL = 3000; // ms

function updateGalleryCounter() {
  if (!galleryCounter) return;
  galleryCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
}

function openGallery(index) {
  if (!galleryLightbox || !galleryImg) return;
  currentGalleryIndex = (index + galleryImages.length) % galleryImages.length;
  galleryImg.src = galleryImages[currentGalleryIndex];
  updateGalleryCounter();
  galleryLightbox.classList.add("active");
  galleryLightbox.setAttribute("aria-hidden", "false");
  startGallerySlideshow();
}

function closeGallery() {
  if (!galleryLightbox) return;
  galleryLightbox.classList.remove("active");
  galleryLightbox.setAttribute("aria-hidden", "true");
  stopGallerySlideshow();
}

function showGalleryNext() {
  openGallery(currentGalleryIndex + 1);
}

function showGalleryPrev() {
  openGallery(currentGalleryIndex - 1);
}

function startGallerySlideshow() {
  stopGallerySlideshow();
  galleryTimer = setInterval(() => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    galleryImg.src = galleryImages[currentGalleryIndex];
    updateGalleryCounter();
  }, GALLERY_INTERVAL);
}

function stopGallerySlideshow() {
  if (galleryTimer) {
    clearInterval(galleryTimer);
    galleryTimer = null;
  }
}

/* Click handlers para thumbnails de la nueva galería */
document.querySelectorAll('.gallery-thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const idx = Number(thumb.dataset.index) || 0;
    openGallery(idx);
  });
});

/* Controles de la galería */
if (galleryPrev) galleryPrev.addEventListener('click', (e) => { e.stopPropagation(); showGalleryPrev(); });
if (galleryNext) galleryNext.addEventListener('click', (e) => { e.stopPropagation(); showGalleryNext(); });
if (galleryClose && galleryLightbox) {
  galleryClose.addEventListener("click", () => {
    closeGallery();
  });
}
if (galleryLightbox) {
  galleryLightbox.addEventListener("click", e => {
    if (e.target === galleryLightbox) {
      closeGallery();
    }
  });
}

/* Navegación por teclado para la galería */
document.addEventListener('keydown', (e) => {
  if (galleryLightbox && galleryLightbox.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeGallery();
    } else if (e.key === 'ArrowRight') {
      showGalleryNext();
    } else if (e.key === 'ArrowLeft') {
      showGalleryPrev();
    }
  }
});

if (location.pathname.includes('modelo-a.html')) {
  /* =====================
     MODELO A — GALERÍA (PREVIEW EN PÁGINA AUTOPLAY 2s; LIGHTBOX SIN AUTOPLAY)
  ===================== */

  const modelImages = [
    "images/modelo-a/exterior-01.jpg",
    "images/modelo-a/exterior-02.jpg",
    "images/modelo-a/interior-01.jpg",
    "images/modelo-a/interior-02.jpg",
    "images/modelo-a/interior-03.jpg",
    "images/modelo-a/planos.jpg"
  ];

  const modelLightbox = document.getElementById("modelLightbox");
  const modelImg = modelLightbox ? modelLightbox.querySelector(".lightbox-img") : null;
  const modelClose = modelLightbox ? modelLightbox.querySelector(".lightbox-close") : null;
  const modelPrev = modelLightbox ? modelLightbox.querySelector(".lightbox-nav.prev") : null;
  const modelNext = modelLightbox ? modelLightbox.querySelector(".lightbox-nav.next") : null;
  const modelCounter = modelLightbox ? modelLightbox.querySelector(".lightbox-counter") : null;

  let currentModelIndex = 0;
  let modelTimer = null;
  const MODEL_INTERVAL = 2000; // ms

  /* --- PAGE PREVIEW (autoplay before opening) --- */
  const modelPreviewImg = document.querySelector('.model-preview .preview-img');
  let currentPreviewIndex = 0;
  let previewTimer = null;
  const PREVIEW_INTERVAL = 2000;

  function startModelPreview() {
    stopModelPreview();
    if (!modelPreviewImg) return;
    previewTimer = setInterval(() => {
      currentPreviewIndex = (currentPreviewIndex + 1) % modelImages.length;
      modelPreviewImg.src = modelImages[currentPreviewIndex];
    }, PREVIEW_INTERVAL);
  }

  function stopModelPreview() {
    if (previewTimer) { clearInterval(previewTimer); previewTimer = null; }
  }

  function updateModelCounter() {
    if (!modelCounter) return;
    modelCounter.textContent = `${currentModelIndex + 1} / ${modelImages.length}`;
  }

  function openModelGallery(index) {
    if (!modelLightbox || !modelImg) return;
    stopModelPreview(); // pause the page preview when opening
    currentModelIndex = (index + modelImages.length) % modelImages.length;
    modelImg.src = modelImages[currentModelIndex];
    updateModelCounter();
    modelLightbox.classList.add("active");
    modelLightbox.setAttribute("aria-hidden", "false");
    // IMPORTANT: intentionally DO NOT start model slideshow — lightbox should not autoplay
  }

  function closeModelGallery() {
    if (!modelLightbox) return;
    modelLightbox.classList.remove("active");
    modelLightbox.setAttribute("aria-hidden", "true");
    stopModelSlideshow();
    startModelPreview(); // resume page preview when closing
  }

  function showModelNext() {
    openModelGallery(currentModelIndex + 1);
  }

  function showModelPrev() {
    openModelGallery(currentModelIndex - 1);
  }

  function startModelSlideshow() {
    stopModelSlideshow();
    modelTimer = setInterval(() => {
      currentModelIndex = (currentModelIndex + 1) % modelImages.length;
      modelImg.src = modelImages[currentModelIndex];
      updateModelCounter();
    }, MODEL_INTERVAL);
  }

  function stopModelSlideshow() { if (modelTimer) { clearInterval(modelTimer); modelTimer = null; } }



  /* Click on preview image opens gallery (at current preview index) */
  if (modelPreviewImg) {
    modelPreviewImg.addEventListener('click', () => {
      stopModelPreview();
      openModelGallery(currentPreviewIndex);
    });
  }

  /* Controles */
  if (modelPrev) modelPrev.addEventListener('click', (e) => { e.stopPropagation(); showModelPrev(); });
  if (modelNext) modelNext.addEventListener('click', (e) => { e.stopPropagation(); showModelNext(); });
  if (modelClose && modelLightbox) { modelClose.addEventListener('click', () => { closeModelGallery(); }); }
  if (modelLightbox) { modelLightbox.addEventListener('click', e => { if (e.target === modelLightbox) closeModelGallery(); }); }

  /* Teclado para la galería del modelo */
  document.addEventListener('keydown', (e) => {
    if (modelLightbox && modelLightbox.classList.contains('active')) {
      if (e.key === 'Escape') { closeModelGallery(); }
      else if (e.key === 'ArrowRight') { showModelNext(); }
      else if (e.key === 'ArrowLeft') { showModelPrev(); }
    }
  });

  /* Initialize preview on page load */
  startModelPreview();
} else {
  /* Not modelo-a; do nothing here — other pages handled by initModelPage() */
}

/* Generic initializer for other model pages (B, C) — uses same behavior as A but scoped per page */
function initModelPage(folder) {
  const images = [
    `images/${folder}/exterior-01.jpg`,
    `images/${folder}/exterior-02.jpg`,
    `images/${folder}/interior-01.jpg`,
    `images/${folder}/interior-02.jpg`,
    `images/${folder}/interior-03.jpg`,
    `images/${folder}/planos.jpg`
  ];

  const previewImg = document.querySelector('.model-preview .preview-img');
  const lightboxEl = document.getElementById('modelLightbox');
  const imgEl = lightboxEl ? lightboxEl.querySelector('.lightbox-img') : null;
  const closeBtn = lightboxEl ? lightboxEl.querySelector('.lightbox-close') : null;
  const prevBtn = lightboxEl ? lightboxEl.querySelector('.lightbox-nav.prev') : null;
  const nextBtn = lightboxEl ? lightboxEl.querySelector('.lightbox-nav.next') : null;
  const counter = lightboxEl ? lightboxEl.querySelector('.lightbox-counter') : null;

  if (!previewImg || !lightboxEl || !imgEl) return;

  let previewIdx = 0;
  let previewTimer = null;
  const INTERVAL = 2000;

  function startPreview() {
    stopPreview();
    previewTimer = setInterval(() => {
      previewIdx = (previewIdx + 1) % images.length;
      previewImg.src = images[previewIdx];
    }, INTERVAL);
  }
  function stopPreview() { if (previewTimer) { clearInterval(previewTimer); previewTimer = null; } }

  let current = 0;

  function updateCounter() { if (counter) counter.textContent = `${current + 1} / ${images.length}`; }
  function openLB(idx) {
    stopPreview();
    current = (idx + images.length) % images.length;
    imgEl.src = images[current];
    updateCounter();
    lightboxEl.classList.add('active');
    lightboxEl.setAttribute('aria-hidden','false');
    // no autoplay inside lightbox
  }
  function closeLB() {
    lightboxEl.classList.remove('active');
    lightboxEl.setAttribute('aria-hidden','true');
    startPreview();
  }
  function showNext() { openLB(current + 1); }
  function showPrev() { openLB(current - 1); }

  previewImg.addEventListener('click', () => { openLB(previewIdx); });
  if (closeBtn) closeBtn.addEventListener('click', closeLB);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (lightboxEl) lightboxEl.addEventListener('click', e => { if (e.target === lightboxEl) closeLB(); });
  document.addEventListener('keydown', (e) => {
    if (!lightboxEl.classList.contains('active')) return;
    if (e.key === 'Escape') closeLB();
    else if (e.key === 'ArrowRight') showNext();
    else if (e.key === 'ArrowLeft') showPrev();
  });

  startPreview();
}

// Detect model page (B or C) and initialize
const path = location.pathname;
if (path.includes('modelo-b.html')) initModelPage('modelo-b');
if (path.includes('modelo-c.html')) initModelPage('modelo-c');
