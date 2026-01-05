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
   LIGHTBOX
===================== */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".lightbox-item").forEach(img => {
  img.addEventListener("click", () => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightbox.classList.add("active");
  });
});

/* Cerrar con botón */
if (lightboxClose && lightbox) {
  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });
}

/* Cerrar clickeando fondo */
if (lightbox) {
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });
}

/* Cerrar con ESC */
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && lightbox?.classList.contains("active")) {
    lightbox.classList.remove("active");
  }
});
