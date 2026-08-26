/**
 * Pixels & Panels - IIT Madras BS Movies & Anime Society
 * Main Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initFaqAccordions();
  initGalleryLightbox();
  initEventFilters();
  initProposalModal();
  initVibePicker();
});

/* --- Navbar Scroll Effect --- */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- Mobile Navigation Drawer --- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggleBtn || !navLinks) return;

  // Create overlay element if not present
  let navOverlay = document.querySelector('.nav-overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  const toggleMenu = (open) => {
    const isExpanded = open !== undefined ? open : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', isExpanded);
    navOverlay.classList.toggle('active', isExpanded);
    toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => toggleMenu());
  navOverlay.addEventListener('click', () => toggleMenu(false));

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* --- FAQ Accordions --- */
function initFaqAccordions() {
  const faqDetails = document.querySelectorAll('.faq details');
  faqDetails.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        faqDetails.forEach(other => {
          if (other !== detail && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
}

/* --- Gallery Lightbox --- */
function initGalleryLightbox() {
  const galleryImgs = document.querySelectorAll('.gallery-grid img');
  if (!galleryImgs.length) return;

  // Create Lightbox DOM structure if missing
  let lightbox = document.getElementById('pnp-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'pnp-lightbox';
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
        <img class="lightbox-img" src="" alt="Enlarged view">
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxCaption.textContent = alt || 'Pixels & Panels Screening Moment';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryImgs.forEach(img => {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `View photo: ${img.alt || 'Screening gallery photo'}`);
    
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --- Event Filters & Search --- */
function initEventFilters() {
  const filterPills = document.querySelectorAll('.event-filter-pill');
  const searchInput = document.getElementById('event-search');
  const eventCards = document.querySelectorAll('.event-card-item');
  const noResultsMsg = document.getElementById('no-events-msg');

  if (!eventCards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  const filterEvents = () => {
    let visibleCount = 0;

    eventCards.forEach(card => {
      const category = card.getAttribute('data-category') || 'all';
      const text = card.textContent.toLowerCase();

      const matchesCat = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = (!searchQuery || text.includes(searchQuery));

      if (matchesCat && matchesSearch) {
        card.style.display = '';
        card.classList.add('fade-in');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in');
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter') || 'all';
      filterEvents();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterEvents();
    });
  }

  // RSVP / Remind buttons
  document.addEventListener('click', (e) => {
    const rsvpBtn = e.target.closest('.btn-rsvp');
    if (rsvpBtn) {
      const eventTitle = rsvpBtn.getAttribute('data-event') || 'Event';
      showToast(`RSVP Confirmed for "${eventTitle}"! Check your inbox for updates.`);
    }
  });
}

/* --- Proposal Modal --- */
function initProposalModal() {
  const modal = document.getElementById('proposal-modal');
  const openBtns = document.querySelectorAll('.trigger-proposal-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');
  const form = modal.querySelector('#proposal-form');

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = form.querySelector('[name="title"]')?.value || 'Title';
      closeModal();
      form.reset();
      showToast(`🎬 Idea for "${title}" submitted to Pixels & Panels team!`);
    });
  }
}

/* --- Cinephile Vibe Picker --- */
function initVibePicker() {
  const vibeBtns = document.querySelectorAll('.vibe-btn');
  const vibeDisplay = document.getElementById('vibe-recommendation-display');

  if (!vibeBtns.length || !vibeDisplay) return;

  const recommendations = {
    cyberpunk: {
      title: "The Matrix & Ghost in the Shell",
      tag: "Cyberpunk & Philosophical Sci-Fi",
      quote: "What is real? How do you define 'real'?",
      desc: "Deep atmospheric visual storytelling exploring digital consciousness, neon aesthetics, and industrial soundscapes.",
      recommendedBy: "Recommended for fans of Blade Runner & Akira",
      badge: "Cine-Logic Society Pick"
    },
    wholesome: {
      title: "Your Name (Kimi no Na wa)",
      tag: "Emotional Visual Masterpiece",
      quote: "Treasure the experience. Dreams fade away after you wake up.",
      desc: "Makoto Shinkai's breathtaking animation featuring celestial color palettes, timeless soundtrack, and profound emotional resonance.",
      recommendedBy: "Screened at IIT Madras BS Open Air 2024",
      badge: "Fan Favorite"
    },
    thriller: {
      title: "Perfect Blue & Paprika",
      tag: "Psychological Mind-Benders",
      quote: "Satoshi Kon's surreal blurring of reality and dreams.",
      desc: "Complex narrative structures, match cuts, and iconic editing technique that inspired modern cinema classics like Inception.",
      recommendedBy: "Discussion Night Spotlight",
      badge: "Panel Review Pick"
    },
    cinema: {
      title: "Interstellar & Dune",
      tag: "Immersive Cinematic Scale",
      quote: "Mankind was born on Earth. It was never meant to die here.",
      desc: "Monumental sound design, IMAX aspect ratio shifts, and grand narrative canvas celebrating the magic of theatrical viewing.",
      recommendedBy: "Recommended for Cinema Enthusiasts",
      badge: "Audience Classic"
    }
  };

  const renderRecommendation = (key) => {
    const item = recommendations[key] || recommendations.cyberpunk;
    vibeDisplay.style.opacity = '0';
    
    setTimeout(() => {
      vibeDisplay.innerHTML = `
        <div class="vibe-card">
          <div class="vibe-header">
            <span class="vibe-badge">${item.badge}</span>
            <span class="vibe-tag">${item.tag}</span>
          </div>
          <h3>${item.title}</h3>
          <blockquote class="vibe-quote">"${item.quote}"</blockquote>
          <p class="vibe-desc">${item.desc}</p>
          <div class="vibe-footer">
            <span class="vibe-rec"><span class="material-symbols-outlined md-18">stars</span> ${item.recommendedBy}</span>
            <button class="btn-secondary trigger-proposal-modal">Propose Next Screening</button>
          </div>
        </div>
      `;
      vibeDisplay.style.opacity = '1';
      initProposalModal(); // Rebind proposal triggers inside display
    }, 200);
  };

  vibeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vibeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const vibe = btn.getAttribute('data-vibe');
      renderRecommendation(vibe);
    });
  });

  // Render initial vibe recommendation
  renderRecommendation('cyberpunk');
}

/* --- Toast Notification Utility --- */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pnp-toast';
  toast.innerHTML = `
    <span class="material-symbols-outlined md-20">check_circle</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
