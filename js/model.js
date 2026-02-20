(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const galleries = document.querySelectorAll('.location-gallery');
    if (!galleries || galleries.length === 0) return;

    // Crear overlay (lightbox) una sola vez
    const overlay = document.createElement('div');
    overlay.className = 'sa-lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = '\n      position:fixed;inset:0;display:none;align-items:center;justify-content:center;\n      background:rgba(0,0,0,0.85);z-index:10000;padding:20px;box-sizing:border-box;\n    '.replace(/\n\s+/g, '');

    overlay.innerHTML = '\n      <button class="sa-lb-close" aria-label="Cerrar" style="position:absolute;right:18px;top:14px;background:transparent;border:none;color:#fff;font-size:34px;line-height:1;cursor:pointer">&times;</button>\n      <button class="sa-lb-prev" aria-label="Anterior" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:40px;cursor:pointer;padding:8px">&#10094;</button>\n      <div class="sa-lb-content" style="max-width:1200px;max-height:90%;width:100%;text-align:center;">\n        <img class="sa-lb-image" src="" alt="" style="max-width:100%;max-height:80vh;display:block;margin:0 auto;box-shadow:0 10px 30px rgba(0,0,0,0.6)">\n        <div class="sa-lb-caption" style="color:#fff;margin-top:10px;font-size:0.95rem"></div>\n      </div>\n      <button class="sa-lb-next" aria-label="Siguiente" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:40px;cursor:pointer;padding:8px">&#10095;</button>\n    '.trim();

    document.body.appendChild(overlay);

    const imgEl = overlay.querySelector('.sa-lb-image');
    const captionEl = overlay.querySelector('.sa-lb-caption');
    const closeBtn = overlay.querySelector('.sa-lb-close');
    const prevBtn = overlay.querySelector('.sa-lb-prev');
    const nextBtn = overlay.querySelector('.sa-lb-next');

    let currentImages = [];
    let currentIndex = 0;

    function openLightbox(index, images) {
      currentImages = images; // array of <img> elements
      currentIndex = index;
      // if opening a single preview image (e.g. PLANTA 2H.jpg) apply large class
      try {
        const node = images[index];
        if (node && node.classList && node.classList.contains('preview-img')) {
          overlay.classList.add('sa-lb--large');
        } else {
          overlay.classList.remove('sa-lb--large');
        }
      } catch (e) {
        overlay.classList.remove('sa-lb--large');
      }
      updateImage();
      overlay.style.display = 'flex';
      // prevent background scroll
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeyDown);
    }

    function closeLightbox() {
      overlay.style.display = 'none';
      overlay.classList.remove('sa-lb--large');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    }

    function updateImage() {
      if (!currentImages || currentImages.length === 0) return;
      const node = currentImages[currentIndex];
      // Use data-full or src as fallback
      const src = node.dataset && node.dataset.full ? node.dataset.full : node.src;
      imgEl.src = src;
      imgEl.alt = node.alt || '';
      captionEl.textContent = node.alt || '';

      // preload neighbors
      const prev = currentImages[(currentIndex - 1 + currentImages.length) % currentImages.length];
      const next = currentImages[(currentIndex + 1) % currentImages.length];
      if (prev) new Image().src = prev.dataset && prev.dataset.full ? prev.dataset.full : prev.src;
      if (next) new Image().src = next.dataset && next.dataset.full ? next.dataset.full : next.src;
    }

    function gotoIndex(i) {
      if (!currentImages || currentImages.length === 0) return;
      currentIndex = (i + currentImages.length) % currentImages.length;
      updateImage();
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') gotoIndex(currentIndex - 1);
      else if (e.key === 'ArrowRight') gotoIndex(currentIndex + 1);
    }

    // events
    overlay.addEventListener('click', function (ev) {
      if (ev.target === overlay) closeLightbox();
    });
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', function () { gotoIndex(currentIndex - 1); });
    nextBtn.addEventListener('click', function () { gotoIndex(currentIndex + 1); });

    // Attach listeners for each gallery found. This adapts to any number of images per model html.
    galleries.forEach(function (gallery) {
      const imgs = Array.from(gallery.querySelectorAll('img'));
      if (!imgs || imgs.length === 0) return;

      imgs.forEach(function (img, idx) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function (e) {
          // pass the node list so the lightbox can read src/alt (and data-full if present)
          openLightbox(idx, imgs);
        });
      });
    });

    // Also attach to model preview images (ej. PLANTA 2H.jpg) so they open enlarged
    const previews = document.querySelectorAll('.preview-img');
    if (previews && previews.length) {
      previews.forEach(function (p) {
        p.style.cursor = 'zoom-in';
        p.addEventListener('click', function () {
          // open lightbox showing only this image
          openLightbox(0, [p]);
        });
      });
    }
  });
})();
