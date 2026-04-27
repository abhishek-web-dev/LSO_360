// ══════════════════════════════════════
//  LSO 360 v3 — script.js
//  Navbar & Footer are inlined — no fetch needed
//  Uses WOW.js + Animate.css for scroll animations
// ══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Navbar: transparent on hero → solid on scroll ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const hasHero = document.querySelector('.hero');

    function updateNav() {
      if (hasHero) {
        navbar.classList.toggle('at-top', window.scrollY < 80);
      } else {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  // ── 2. Set active nav link ───────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === page) a.classList.add('active');
  });



  // ── 4. WOW.js init ───────────────────
  if (typeof WOW !== 'undefined') {
    new WOW({
      boxClass:       'wow',
      animateClass:   'animated',
      offset:         50,    // Reduced offset for mobile to trigger sooner
      mobile:         true,  // ✅ Re-enabled for mobile
      live:           true,
      resetAnimation: false,
    }).init();
  } else {
    // Fallback: IntersectionObserver if WOW not loaded
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.visibility = 'visible';
          e.target.classList.add('animate__animated', 'animate__fadeInUp');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }); 
    
    document.querySelectorAll('.wow').forEach(el => {
      el.style.visibility = 'hidden'; // Ensure they are hidden initially to animate in
      obs.observe(el);
    });
  }

  // ── 5. Number Counter Animation ──────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  // ── 6. Before/After Slider ───────────
  const bafWrap    = document.getElementById('bafWrap');
  const bafBefore  = document.getElementById('bafBefore');
  const bafDivider = document.getElementById('bafDivider');

  if (bafWrap && bafDivider) {
    let dragging = false;

    function setPos(pct) {
      pct = Math.max(5, Math.min(95, pct));
      bafDivider.style.left = pct + '%';
      bafBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    }
    setPos(50);

    bafDivider.addEventListener('mousedown',  e => { dragging = true; e.preventDefault(); });
    bafDivider.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const r = bafWrap.getBoundingClientRect();
      setPos(((e.clientX - r.left) / r.width) * 100);
    });
    document.addEventListener('touchmove', e => {
      if (!dragging) return;
      const r = bafWrap.getBoundingClientRect();
      setPos(((e.touches[0].clientX - r.left) / r.width) * 100);
    }, { passive: true });
    document.addEventListener('mouseup',  () => { dragging = false; });
    document.addEventListener('touchend', () => { dragging = false; });
  }

});

// ── Mobile nav ──────────────────────
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav') || document.querySelector('.mobile-nav');
  if (nav) nav.classList.toggle('open');
}

// ── Counter helper ───────────────────
function animateCounter(el) {
  const target    = parseFloat(el.dataset.count);
  const suffix    = el.dataset.suffix || '';
  const duration  = 2000;
  const steps     = 60;
  const increment = target / steps;
  let current = 0, step = 0;

  const timer = setInterval(() => {
    step++;
    current += increment;
    if (step >= steps) { current = target; clearInterval(timer); }
    el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
  }, duration / steps);
}


document.addEventListener('click', function(e) {
  const nav = document.getElementById('mobileNav') || document.querySelector('.mobile-nav');
  const btn = document.querySelector('.nav-toggle');

  if (!nav || !btn) return;

  if (!nav.contains(e.target) && !btn.contains(e.target)) {
    nav.classList.remove('open');
  }
});


 /* ── COMPARISON SECTION ── */
    function showCmpFilter(type) {
      var rows = document.querySelectorAll('.cmp-row');
      rows.forEach(function(row) {
        var rowType = row.getAttribute('data-type');
        if (type === 'all') {
          row.classList.remove('hidden');
        } else if (type === 'win' && rowType === 'win') {
          row.classList.remove('hidden');
        } else if (type === 'tie' && rowType === 'tie') {
          row.classList.remove('hidden');
        } else {
          row.classList.add('hidden');
        }
      });
      document.querySelectorAll('.cmp-toggle').forEach(function(btn) { btn.classList.remove('active'); });
      var id = 'cmp' + type.charAt(0).toUpperCase() + type.slice(1) + 'Btn';
      document.getElementById(id).classList.add('active');
    }

    function animateCmpScores() {
      const lsoWins = document.querySelectorAll('.cmp-row[data-type="win"]').length;
      const yoastWins = 1;
      const total = lsoWins + yoastWins;
      const lsoEl = document.getElementById('lsoScore');
      const yoastEl = document.getElementById('yoastScore');
      const lsoBarEl = document.getElementById('lsoBar');
      const yoastBarEl = document.getElementById('yoastBar');
      
      if (!lsoEl || !yoastEl) return;

      const duration = 1500;
      let startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        
        lsoEl.textContent = Math.round(ease * lsoWins);
        yoastEl.textContent = Math.round(ease * yoastWins);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          lsoEl.textContent = lsoWins;
          yoastEl.textContent = yoastWins;
        }
      }
      requestAnimationFrame(step);

      if (lsoBarEl && yoastBarEl) {
        setTimeout(function() {
          lsoBarEl.style.width = Math.round((lsoWins / total) * 100) + '%';
          yoastBarEl.style.width = Math.round((yoastWins / total) * 100) + '%';
        }, 100);
      }
    }

    const cmpSection = document.querySelector('.cmp-section');
    if (cmpSection) {
      let scoreAnimated = false;
      const cmpObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !scoreAnimated) {
            scoreAnimated = true;
            animateCmpScores();
            cmpObserver.unobserve(cmpSection);
          }
        });
      }, { threshold: 0.1 }); // Trigger as soon as 10% is visible for all devices
      cmpObserver.observe(cmpSection);
    }


    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
      let confettiFired = false;
      const resultsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !confettiFired) {
            confettiFired = true;
            firePartyPopper();
          }
        });
      }, { threshold: 0.3 });
      resultsObserver.observe(resultsSection);
    }

    function firePartyPopper() {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }


const slider = document.getElementById("videoSlider");
const slides = document.querySelectorAll(".video-slide");

if (slider) {
  document.querySelector(".next").onclick = () => {
    slider.scrollBy({ left: slider.clientWidth - 100, behavior: "smooth" });
  };

  document.querySelector(".prev").onclick = () => {
    slider.scrollBy({ left: -(slider.clientWidth - 100), behavior: "smooth" });
  };

  slides.forEach(slide => {
    const video = slide.querySelector("video");
    
    slide.onclick = () => {
      if (video.paused) {
        // Stop all other videos
        document.querySelectorAll(".video-slide video").forEach(v => {
          v.pause();
          v.parentElement.classList.remove("playing");
        });
        
        // Play this video
        video.play();
        slide.classList.add("playing");
      } else {
        // Pause this video
        video.pause();
        slide.classList.remove("playing");
      }
    };

    // When video ends, remove playing class
    video.onended = () => {
      slide.classList.remove("playing");
    };
  });
}

// ── FAQ Toggle ──────────────────────
function toggleFaq(el) {
  const item = el.parentElement;
  const isActive = item.classList.contains('active');
  
  // Close all other items
  document.querySelectorAll('.faq-item').forEach(otherItem => {
    if (otherItem !== item) otherItem.classList.remove('active');
  });
  
  // Toggle current item
  item.classList.toggle('active');
}

// ── Location Slider ───────────────────
const locSlider = document.getElementById('locationSlider');
if (locSlider) {
  const nextBtn = document.querySelector('.loc-btn.next');
  const prevBtn = document.querySelector('.loc-btn.prev');
  
  // Calculate dynamic scroll amount based on exactly 1 card width + gap
  const getScrollAmount = () => {
    const card = locSlider.querySelector('.location-card');
    const gap = parseFloat(window.getComputedStyle(locSlider).gap) || 30;
    return card ? card.offsetWidth + gap : 350;
  };

  const isDelhiPage = window.location.pathname.includes('best-seo-services-in-delhi.html');
  let autoScroll;

  if (!isDelhiPage) {
    autoScroll = setInterval(() => {
      if (Math.ceil(locSlider.scrollLeft + locSlider.clientWidth) >= locSlider.scrollWidth - 10) {
        locSlider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        locSlider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    }, 4000);
  }

  const resetInterval = () => {
    if (isDelhiPage) return;
    clearInterval(autoScroll);
    autoScroll = setInterval(() => {
      if (Math.ceil(locSlider.scrollLeft + locSlider.clientWidth) >= locSlider.scrollWidth - 10) {
        locSlider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        locSlider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    }, 4000);
  };

  if (nextBtn) {
    nextBtn.onclick = () => {
      locSlider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      resetInterval();
    };
  }
  
  if (prevBtn) {
    prevBtn.onclick = () => {
      locSlider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      resetInterval();
    };
  }

  locSlider.onmouseenter = () => clearInterval(autoScroll);
  locSlider.onmouseleave = resetInterval;
}