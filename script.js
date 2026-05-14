(() => {
  const nav = document.getElementById('nav');
  const menuBtn = nav?.querySelector('.nav__menu');

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblings = Array.from(el.parentElement?.querySelectorAll(':scope > .reveal') || [el]);
          const idx = Math.max(0, siblings.indexOf(el));
          el.style.setProperty('--reveal-delay', (idx * 90) + 'ms');
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const mapEl = document.getElementById('mapa');
  if (mapEl && window.L) {
    const coords = [-23.59569, -46.68466]; // Rua Tenerife, 67 · Vila Olímpia, SP
    const map = L.map(mapEl, {
      center: coords,
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap · CARTO'
    }).addTo(map);

    const pin = L.divIcon({
      className: 'bh-pin',
      html: '<span class="bh-pin__halo"></span><span class="bh-pin__core"></span>',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    L.marker(coords, { icon: pin, keyboard: false, title: 'Instituto Bárbara Helen' })
      .addTo(map)
      .bindPopup(
        '<strong style="font-family:Cormorant Garamond,serif;font-size:16px;color:#1c2622;">Instituto Bárbara Helen</strong>' +
        '<br><span style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a6b51;">Rua Tenerife, 67 · Vila Olímpia</span>'
      );

    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());
  }
})();
