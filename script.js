/* ============================================================
   PORTFOLIO — script.js
   Handles:
   1. Navbar scroll effect + active link highlighting
   2. Hamburger mobile menu
   3. Scroll-triggered fade-in animations
   4. Counter animation for About stats
   5. Project category filtering
   6. Contact form validation & submission
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR — SCROLL EFFECT & ACTIVE LINK
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

/**
 * Add/remove .scrolled class on navbar when user scrolls past 60px.
 * Also highlights the nav link matching the visible section.
 */
function handleNavbarScroll() {
  // Scroll glow effect
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlighting based on current scroll position
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });


/* ============================================================
   2. HAMBURGER MOBILE MENU
   ============================================================ */
const hamburger     = document.getElementById('hamburger');
const navLinksPanel = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksPanel.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = navLinksPanel.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinksPanel.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksPanel.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ============================================================
   3. SCROLL-TRIGGERED FADE-IN ANIMATIONS
   Uses IntersectionObserver for performance.
   ============================================================ */
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once revealed (no need to re-trigger)
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,      // Trigger when 12% of the element is visible
    rootMargin: '0px 0px -40px 0px', // Trigger slightly before bottom of viewport
  }
);

fadeElements.forEach(el => fadeObserver.observe(el));


/* ============================================================
   4. COUNTER ANIMATION — About stats
   Animates numbers from 0 to target when section enters view.
   ============================================================ */
const statNumbers = document.querySelectorAll('.stat-num');

/**
 * Animate a single counter from 0 to its data-target value.
 * @param {HTMLElement} el - The element containing the number.
 */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1500; // ms
  const start    = performance.now();

  function step(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target; // Ensure exact final value
    }
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));


/* ============================================================
   5. PROJECT FILTER
   Filters project cards by category on filter button click.
   ============================================================ */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach((card, index) => {
      const category = card.getAttribute('data-category');
      const show = (filter === 'all') || (category === filter);

      if (show) {
        // Remove hidden and re-trigger fade-in with stagger
        card.classList.remove('hidden');
        card.classList.remove('visible');
        // Small timeout so CSS transition re-plays
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 60);
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  });
});

// Show all cards visible on load
projectCards.forEach(card => card.classList.add('visible'));


/* ============================================================
   6. CONTACT FORM — VALIDATION & SUBMISSION
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');
const submitBtn   = document.getElementById('submitBtn');

/**
 * Validates a form field and returns true if valid.
 * Shows / clears inline error messages.
 *
 * @param {string} fieldId  - The input's id attribute.
 * @param {string} errorId  - The error span's id attribute.
 * @param {Function} validator - Fn(value) → error string | null.
 * @returns {boolean}
 */
function validateField(fieldId, errorId, validator) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  const message = validator(field.value.trim());

  if (message) {
    field.classList.add('error');
    error.textContent = message;
    return false;
  } else {
    field.classList.remove('error');
    error.textContent = '';
    return true;
  }
}

// Individual validators — ✏️ EDIT validation rules here if needed
const validators = {
  nameInput: value => {
    if (!value)           return 'Name is required.';
    if (value.length < 2) return 'Name must be at least 2 characters.';
    return null;
  },
  emailInput: value => {
    if (!value) return 'Email is required.';
    // Basic email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email.';
    return null;
  },
  subjectInput: value => {
    if (!value)           return 'Subject is required.';
    if (value.length < 3) return 'Subject must be at least 3 characters.';
    return null;
  },
  messageInput: value => {
    if (!value)            return 'Message is required.';
    if (value.length < 10) return 'Message must be at least 10 characters.';
    return null;
  },
};

// Live validation on blur (when user leaves a field)
['nameInput', 'emailInput', 'subjectInput', 'messageInput'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', () => {
    validateField(id, `${id.replace('Input', 'Error')}`, validators[id]);
  });
  // Clear error while typing
  el.addEventListener('input', () => {
    el.classList.remove('error');
    const errorEl = document.getElementById(`${id.replace('Input', 'Error')}`);
    if (errorEl) errorEl.textContent = '';
  });
});

/**
 * Handles form submission:
 * 1. Validates all fields.
 * 2. If valid, simulates a send (replace with real API call / EmailJS / Formspree).
 * 3. Shows success or error message.
 */
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate all fields
  const validations = [
    validateField('nameInput',    'nameError',    validators.nameInput),
    validateField('emailInput',   'emailError',   validators.emailInput),
    validateField('subjectInput', 'subjectError', validators.subjectInput),
    validateField('messageInput', 'messageError', validators.messageInput),
  ];

  const isFormValid = validations.every(Boolean);

  if (!isFormValid) {
    // Scroll to first error
    const firstError = contactForm.querySelector('.error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Disable button during "send"
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending...';
  formStatus.className = 'form-status';
  formStatus.style.display = 'none';

  try {
    /* ✏️ EDIT: Replace this block with your actual form handler.
       Options:
       - Formspree:  fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: formData })
       - EmailJS:    emailjs.sendForm('SERVICE', 'TEMPLATE', contactForm)
       - Your API:   fetch('/api/contact', { method:'POST', body: JSON.stringify(data) })
    */
    await simulateSend(); // Remove this line when using a real service

    // Success
    formStatus.className = 'form-status success';
    formStatus.textContent = '✅ Message sent! I\'ll get back to you soon.';
    contactForm.reset();

  } catch (err) {
    // Error
    formStatus.className = 'form-status error';
    formStatus.textContent = '❌ Something went wrong. Please try again or email me directly.';

  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
  }
});

/**
 * Simulates a 1.5s network delay for demo purposes.
 * ✏️ DELETE this function when you hook up a real form service.
 */
function simulateSend() {
  return new Promise((resolve) => setTimeout(resolve, 1500));
}


/* ============================================================
   UTILITY — Smooth scroll for older browsers (fallback)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
