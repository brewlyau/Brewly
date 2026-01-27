// Google Sheets Web App URLs
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbznlns7ciuHc3WQUkXbU2ryFwcKnZA9fXpAvWY-glRAcPNna-CZlcVWg34ZmQk82e9p/exec';
const CAFE_REQUEST_URL = 'https://script.google.com/macros/s/AKfycbwUayxcQPlNB3DzPcieiZuG2CZoKF-IeIdtVNZF-G1FvKqTvp7jHcEHmSbRvMDDmVu-gg/exec';

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

  // Hero phone carousel for mobile - manual with swipe
  const heroPhones = document.querySelector('.hero-phones');
  const phones = document.querySelectorAll('.hero-phone');
  const dots = document.querySelectorAll('.carousel-dot');

  if (phones.length === 3 && dots.length === 3 && heroPhones) {
    let current = 0;
    let startX = 0;

    function show(n) {
      if (n < 0) n = 2;
      if (n > 2) n = 0;
      for (let i = 0; i < 3; i++) {
        phones[i].classList.remove('carousel-active');
        dots[i].classList.remove('active');
      }
      phones[n].classList.add('carousel-active');
      dots[n].classList.add('active');
      current = n;
    }

    // Dot clicks
    for (let i = 0; i < 3; i++) {
      dots[i].addEventListener('click', () => show(i));
    }

    // Swipe/drag support
    let isDragging = false;

    heroPhones.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    heroPhones.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (diff > 30) show(current + 1);
      if (diff < -30) show(current - 1);
    }, { passive: true });

    // Mouse drag for desktop testing
    heroPhones.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
    });

    heroPhones.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.clientX;
      if (diff > 30) show(current + 1);
      if (diff < -30) show(current - 1);
    });

    heroPhones.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    // Init on load and resize
    function init() {
      if (window.innerWidth <= 900) {
        heroPhones.classList.add('js-loaded');
        show(0);
      } else {
        heroPhones.classList.remove('js-loaded');
        for (let i = 0; i < 3; i++) {
          phones[i].classList.remove('carousel-active');
          dots[i].classList.remove('active');
        }
      }
    }

    window.addEventListener('resize', init);
    init();
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

  // Savings calculator
  const coffeePrice = document.getElementById('coffee-price');
  const coffeesPerWeek = document.getElementById('coffees-per-week');
  const discountPercent = document.getElementById('discount-percent');

  if (coffeePrice && coffeesPerWeek && discountPercent) {
    const coffeePriceValue = document.getElementById('coffee-price-value');
    const coffeesPerWeekValue = document.getElementById('coffees-per-week-value');
    const discountPercentValue = document.getElementById('discount-percent-value');
    const costWithout = document.getElementById('cost-without');
    const costWith = document.getElementById('cost-with');
    const weeklySavings = document.getElementById('weekly-savings');
    const savingsDetail = document.getElementById('savings-detail');
    const weeklyFree = document.getElementById('weekly-free');
    const monthlyFree = document.getElementById('monthly-free');
    const yearlyFree = document.getElementById('yearly-free');

    function updateCalculator() {
      const price = parseFloat(coffeePrice.value);
      const cups = parseInt(coffeesPerWeek.value);
      const discount = parseInt(discountPercent.value) / 100;

      // Update display values
      coffeePriceValue.textContent = `$${price.toFixed(2)}`;
      coffeesPerWeekValue.textContent = cups;
      discountPercentValue.textContent = `${discountPercent.value}%`;

      // Calculate costs and savings
      const weeklyTotal = price * cups;
      const weeklyWithBrewly = weeklyTotal * (1 - discount);
      const weeklySaved = weeklyTotal * discount;
      const monthlySaved = weeklySaved * 4.33;
      const yearlySaved = weeklySaved * 52;
      const weeklyFreeCoffees = weeklySaved / price;
      const monthlyFreeCoffees = Math.floor(monthlySaved / price);
      const yearlyFreeCoffees = Math.floor(yearlySaved / price);

      // Update results
      costWithout.textContent = `$${weeklyTotal.toFixed(2)}`;
      costWith.textContent = `$${weeklyWithBrewly.toFixed(2)}`;
      weeklySavings.innerHTML = `$${weeklySaved.toFixed(2)}<span class="result-period">/week</span>`;
      savingsDetail.textContent = `$${Math.round(monthlySaved)}/month, $${Math.round(yearlySaved)}/year`;
      weeklyFree.textContent = weeklyFreeCoffees < 1 ? weeklyFreeCoffees.toFixed(1) : Math.floor(weeklyFreeCoffees);
      monthlyFree.textContent = monthlyFreeCoffees;
      yearlyFree.textContent = yearlyFreeCoffees;
    }

    coffeePrice.addEventListener('input', updateCalculator);
    coffeesPerWeek.addEventListener('input', updateCalculator);
    discountPercent.addEventListener('input', updateCalculator);

    // Initial calculation
    updateCalculator();
  }

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

  // Waitlist form submission
  const waitlistForm = document.getElementById('waitlist-form');
  const waitlistStatus = document.getElementById('waitlist-status');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = waitlistForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Joining...';
      submitBtn.disabled = true;
      waitlistStatus.textContent = '';
      waitlistStatus.className = 'waitlist-status';

      const formData = new FormData(waitlistForm);
      formData.append('type', 'waitlist');
      formData.append('timestamp', new Date().toISOString());

      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        });

        // With no-cors mode, we can't read the response, so assume success
        waitlistStatus.textContent = "You're on the list! We'll be in touch soon.";
        waitlistStatus.classList.add('success');
        waitlistForm.reset();
      } catch (error) {
        waitlistStatus.textContent = 'Something went wrong. Please try again.';
        waitlistStatus.classList.add('error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Request a Cafe form submission
  const requestCafeForm = document.getElementById('request-cafe-form');
  const requestCafeStatus = document.getElementById('request-cafe-status');

  if (requestCafeForm) {
    requestCafeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = requestCafeForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      requestCafeStatus.textContent = '';
      requestCafeStatus.className = 'request-cafe-status';

      const formData = new FormData(requestCafeForm);
      formData.append('type', 'cafe_request');
      formData.append('timestamp', new Date().toISOString());

      try {
        await fetch(CAFE_REQUEST_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        });

        requestCafeStatus.textContent = "Thanks! We'll reach out to them and let you know.";
        requestCafeStatus.classList.add('success');
        requestCafeForm.reset();
      } catch (error) {
        requestCafeStatus.textContent = 'Something went wrong. Please try again.';
        requestCafeStatus.classList.add('error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
