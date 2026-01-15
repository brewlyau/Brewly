// Google Sheets Web App URL - Replace with your deployed Apps Script URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbypPqx6SYM8g8kgJYC5_EAVyJrwHyVBgXYoZ87ksmGb4a52L6CAcb38hWFe9ikfXej4/exec';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('h3');
    if (question) {
      question.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!wasActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // Scroll animations (index page only)
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
  }

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      const formData = new FormData(contactForm);
      formData.append('timestamp', new Date().toISOString());

      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        });

        // With no-cors mode, we can't read the response, so assume success
        formStatus.textContent = 'Thanks! Your message has been sent.';
        formStatus.classList.add('success');
        contactForm.reset();
      } catch (error) {
        formStatus.textContent = 'Something went wrong. Please try again.';
        formStatus.classList.add('error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
