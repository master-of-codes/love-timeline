/* ============================================
   MEMORY TIMELINE – VANILLA JS
   ============================================ */

// ──────── DATA ────────
const carouselImages = [
  './assets/wedding.png',
  './assets/first call.png',
  './assets/first meet.png',
  './assets/engagement.png',
  './assets/movie.png',
  './assets/anniversary.png',
  
];


const memories = [
  {
    id: 1,
    title: "First Call",
    date: "November 4, 2022",
    description: "The first phone call that started it all. Nervous voices, endless laughter, and a connection that felt like destiny. Hours passed like minutes.",
    location: "Chennai",
    images: [
      "./assets/first call.png",
      "./assets/first call.png"
    ]
  },
  {
    id: 2,
    title: "First Meet",
    date: "November 6, 2022",
    description: "Our eyes met for the very first time. The world stood still. Every moment felt magical, like a scene from a beautiful love story.",
    location: "Chennai",
    images: [
      "./assets/first meet.png",
      "./assets/first meet.png",
      "./assets/first meet.png"
    ]
  },
  {
    id: 3,
    title: "Engagement",
    date: "November 26, 2022",
    description: "A beautiful ceremony where families came together and two souls were promised to each other. Surrounded by love, blessings, and joyful tears.",
    location: "Chennai",
    images: [
      "./assets/engagement.png",
      "./assets/engagement.png"
    ]
  },
  {
    id: 4,
    title: "First Movie",
    date: "January 13, 2023",
    description: "Our first movie date together! Sharing popcorn, holding hands in the dark, and stealing glances. A memory we'll treasure forever.",
    location: "Chennai",
    images: [
      "./assets/movie.png"
    ]
  },
  {
    id: 5,
    title: "Wedding",
    date: "June 01, 2023",
    description: "The most beautiful day of our lives. Two hearts became one in a celebration of love, family, and new beginnings. Our forever started here. ❤️",
    location: "Chennai",
    images: [
      "./assets/wedding.png",
      "./assets/wedding.png",
      "./assets/wedding.png"
    ]
  },
  {
    id: 6,
    title: "First Anniversary",
    date: "June 01, 2024",
    description: "One year of laughter, love, growth, and togetherness. Celebrating 365 days of our beautiful journey together.",
    location: "Chennai",
    images: [
      "./assets/anniversary.png",
      "./assets/anniversary.png"
    ]
  }
];

// ──────── SCROLL PROGRESS BAR ────────
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
  }, { passive: true });
})();

// ──────── CAROUSEL ────────
(function initCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  // Duplicate images for seamless loop
  const allImages = [...carouselImages, ...carouselImages];
  allImages.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Memory photo ${(i % carouselImages.length) + 1}`;
    img.loading = 'lazy';
    slide.appendChild(img);
    track.appendChild(slide);
  });

  // Touch swipe support
  let startX = 0;
  let scrollLeft = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollLeft = track.parentElement.scrollLeft;
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  track.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
})();

// ──────── TIMELINE RENDERING ────────
(function renderTimeline() {
  const list = document.getElementById('memoriesList');
  if (!list) return;

  memories.forEach((mem, idx) => {
    const side = idx % 2 === 0 ? 'left' : 'right';
    const item = document.createElement('div');
    item.className = `memory-item ${side}`;
    item.setAttribute('data-memory-id', mem.id);

    item.innerHTML = `
      <div class="memory-card" role="button" tabindex="0" aria-label="View ${mem.title} memory">
        <img class="memory-card-image" src="${mem.images[0]}" alt="${mem.title}" loading="lazy">
        <div class="memory-card-body">
          <h4 class="memory-card-title">${mem.title}</h4>
          <p class="memory-card-date">${mem.date}</p>
        </div>
      </div>
    `;

    // Click to open modal
    const card = item.querySelector('.memory-card');
    card.addEventListener('click', () => openModal(mem));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(mem); }
    });

    list.appendChild(item);
  });
})();

// ──────── INTERSECTION OBSERVER (SCROLL REVEAL) ────────
(function initScrollReveal() {
  const items = document.querySelectorAll('.memory-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
})();

// ──────── MODAL LOGIC ────────
let currentGalleryIndex = 0;
let currentGalleryImages = [];
let galleryAutoTimer = null;

function openModal(memory) {
  const modal = document.getElementById('memoryModal');
  document.getElementById('modalTitle').textContent = memory.title;
  document.getElementById('modalDate').textContent = memory.date;
  document.getElementById('modalDesc').textContent = memory.description;
  document.getElementById('modalLocText').textContent = memory.location;

  // Gallery
  const gallery = document.getElementById('modalGallery');
  gallery.innerHTML = '';
  currentGalleryImages = memory.images;
  currentGalleryIndex = 0;

  memory.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${memory.title} photo ${i + 1}`;
    if (i === 0) img.classList.add('gallery-active');
    gallery.appendChild(img);
  });

  // Dots (only if more than 1 image)
  const existingDots = gallery.parentElement.querySelector('.gallery-dots');
  if (existingDots) existingDots.remove();

  if (memory.images.length > 1) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'gallery-dots';
    memory.images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
    gallery.insertAdjacentElement('afterend', dotsContainer);

    // Auto-rotate carousel
    startGalleryAuto();
  }

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Add swipe and keyboard support
  initGalleryControls();
}

function initGalleryControls() {
  const modal = document.getElementById('memoryModal');
  const galleryContainer = document.querySelector('.modal-gallery').parentElement;

  // Keyboard navigation
  const handleKeydown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
      goToSlide(prev);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (currentGalleryIndex + 1) % currentGalleryImages.length;
      goToSlide(next);
    }
  };

  modal.addEventListener('keydown', handleKeydown);

  // Swipe support
  let startX = 0;
  let startY = 0;
  let isSwiping = false;

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isSwiping = true;
    clearInterval(galleryAutoTimer);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isSwiping) return;
    isSwiping = false;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swipe left - next image
        const next = (currentGalleryIndex + 1) % currentGalleryImages.length;
        goToSlide(next);
      } else {
        // Swipe right - prev image
        const prev = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        goToSlide(prev);
      }
    }

    startGalleryAuto();
  };

  galleryContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
  galleryContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
  galleryContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function goToSlide(index) {
  const gallery = document.getElementById('modalGallery');
  const imgs = gallery.querySelectorAll('img');
  const dots = gallery.parentElement.querySelectorAll('.gallery-dot');

  imgs.forEach(img => img.classList.remove('gallery-active'));
  dots.forEach(dot => dot.classList.remove('active'));

  currentGalleryIndex = index;
  if (imgs[index]) imgs[index].classList.add('gallery-active');
  if (dots[index]) dots[index].classList.add('active');
}

function startGalleryAuto() {
  clearInterval(galleryAutoTimer);
  galleryAutoTimer = setInterval(() => {
    const next = (currentGalleryIndex + 1) % currentGalleryImages.length;
    goToSlide(next);
  }, 3000);
}

function closeModal() {
  const modal = document.getElementById('memoryModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  clearInterval(galleryAutoTimer);

  // Clean up dots
  const existingDots = document.querySelector('.modal-scrollable-content .gallery-dots');
  if (existingDots) existingDots.remove();
}

// Close handlers
document.getElementById('closeModal').addEventListener('click', closeModal);

document.getElementById('memoryModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ──────── PWA INSTALL LOGIC ────────
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Double click / double tap on final text triggers install dialog
const finalText = document.getElementById('finalText');
let lastTap = 0;

finalText.addEventListener('dblclick', showPwaDialog);

// Mobile double-tap detection
finalText.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 400) {
    e.preventDefault();
    showPwaDialog();
  }
  lastTap = now;
});

function showPwaDialog() {
  const dialog = document.getElementById('pwaDialog');
  dialog.classList.remove('hidden');
}

document.getElementById('pwaCancel').addEventListener('click', () => {
  document.getElementById('pwaDialog').classList.add('hidden');
});

document.getElementById('pwaInstall').addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    console.log('Install result:', result.outcome);
    deferredPrompt = null;
  } else {
    alert('App install is not available right now. Try opening in Chrome on your phone!');
  }
  document.getElementById('pwaDialog').classList.add('hidden');
});

// ──────── SERVICE WORKER REGISTRATION ────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW registration failed:', err));
  });
}
