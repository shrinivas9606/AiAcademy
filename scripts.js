// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => mainNav.classList.toggle('show'));

  // Hero course slider
  const slides = Array.from(document.querySelectorAll('.course-slider .slide'));
  let slideIndex = 0;
  const showSlide = (i) => {
    slides.forEach(s => s.classList.remove('active'));
    slides[(i+slides.length)%slides.length].classList.add('active');
  };
  document.getElementById('prevSlide').addEventListener('click', () => {
    slideIndex = (slideIndex-1+slides.length)%slides.length; showSlide(slideIndex);
  });
  document.getElementById('nextSlide').addEventListener('click', () => {
    slideIndex = (slideIndex+1)%slides.length; showSlide(slideIndex);
  });
  // auto rotate every 2s
  setInterval(() => { slideIndex = (slideIndex+1)%slides.length; showSlide(slideIndex); }, 4000);

  // Testimonials slider
  const testi = Array.from(document.querySelectorAll('.testi-slider .testi'));
  let testiIndex = 0;
  const showTesti = (i) => {
    testi.forEach(t => t.classList.remove('active'));
    testi[(i+testi.length)%testi.length].classList.add('active');
  };
  document.getElementById('prevTesti').addEventListener('click', () => {
    testiIndex = (testiIndex-1+testi.length)%testi.length; showTesti(testiIndex);
  });
  document.getElementById('nextTesti').addEventListener('click', () => {
    testiIndex = (testiIndex+1)%testi.length; showTesti(testiIndex);
  });
  setInterval(() => { testiIndex = (testiIndex+1)%testi.length; showTesti(testiIndex); }, 4000);

  // contact form simple handler
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    if(!name || !email || !message) {
      formMsg.textContent = 'Please fill the required fields.';
      return;
    }
    // Simulate submit (replace with fetch to backend)
    formMsg.textContent = 'Thanks! Your message has been sent.';
    contactForm.reset();
    setTimeout(()=>formMsg.textContent='',4000);
  });

  // set footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // news ticker duplication for continuous scroll
  const ticker = document.getElementById('newsTicker');
  ticker.innerHTML = ticker.innerHTML + ticker.innerHTML;
});


  /* ===== News Slider + Read More + Relative Dates ===== */
  const newsSlider = document.getElementById('newsSlider');
  const newsTrack  = document.getElementById('newsTrack');
  const newsPrev   = document.getElementById('newsPrev');
  const newsNext   = document.getElementById('newsNext');
  const newsCards  = Array.from(document.querySelectorAll('.news-card'));
  let newsIndex = 0;

  // slides-per-view from CSS variable
  const getSPV = () => {
    const spv = parseInt(getComputedStyle(newsSlider).getPropertyValue('--spv'), 10);
    return isNaN(spv) ? 1 : spv;
  };

  const updateNewsSlider = () => {
    const spv = getSPV();
    const maxIndex = Math.max(0, newsCards.length - spv);
    if (newsIndex > maxIndex) newsIndex = 0;         // wrap around
    if (newsIndex < 0) newsIndex = maxIndex;         // wrap around
    newsTrack.style.transform = `translateX(-${(100 / spv) * newsIndex}%)`;
  };

  newsPrev.addEventListener('click', () => { newsIndex--; updateNewsSlider(); });
  newsNext.addEventListener('click', () => { newsIndex++; updateNewsSlider(); });
  window.addEventListener('resize', updateNewsSlider);
  updateNewsSlider();

  // Auto-advance every 2s
  let newsTimer = setInterval(() => { newsIndex++; updateNewsSlider(); }, 4000);
  ['mouseenter','focusin'].forEach(ev => newsSlider.addEventListener(ev, () => clearInterval(newsTimer)));
  ['mouseleave','focusout'].forEach(ev => newsSlider.addEventListener(ev, () => {
    newsTimer = setInterval(() => { newsIndex++; updateNewsSlider(); }, 4000);
  }));

  // Read More toggles
  document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.news-card');
      const desc = card.querySelector('.news-desc');
      const expanded = desc.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.textContent = expanded ? 'Read Less' : 'Read More';
    });
  });

  // Relative dates (updates every minute)
  function labelFromDate(dateStr) {
    const now = new Date();
    // Ensure local date at midnight so TZ doesn’t shift a day
    const d = new Date(dateStr + 'T00:00:00');
    const diff = (now - d) / 1000; // seconds
    if (diff < 60) return 'Uploaded just now';
    if (diff < 3600) {
      const m = Math.floor(diff / 60);
      return `Uploaded ${m} minute${m > 1 ? 's' : ''} ago`;
    }
    if (diff < 86400) {
      const h = Math.floor(diff / 3600);
      return `Uploaded ${h} hour${h > 1 ? 's' : ''} ago`;
    }
    if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return `Uploaded ${days} day${days > 1 ? 's' : ''} ago`;
    }
    if (diff < 2629800) {
      const w = Math.floor(diff / 604800);
      return `Uploaded ${w} week${w > 1 ? 's' : ''} ago`;
    }
    const months = Math.floor(diff / 2629800);
    return `Uploaded ${months} month${months > 1 ? 's' : ''} ago`;
  }

  function refreshNewsDates() {
    document.querySelectorAll('.news-card').forEach(card => {
      const dateStr = card.getAttribute('data-date');
      const slot = card.querySelector('.news-date');
      if (dateStr && slot) slot.textContent = labelFromDate(dateStr);
    });
  }
  refreshNewsDates();
  setInterval(refreshNewsDates, 60000);


  // Admin login password protection
const adminLoginLink = document.getElementById('adminLoginLink');
if (adminLoginLink) {
  adminLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    const passcode = prompt("Please enter the admin passcode:");
    if (passcode === 'Prasad@5106') { // Use a secure passcode in a real app
      window.location.href = 'myenroll.html';
    } else {
      alert("Incorrect passcode. Access denied.");
    }
  });
}