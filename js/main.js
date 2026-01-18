// Google Sheets Web App URL - Replace with your deployed Apps Script URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxWxeVr5UGCsRnPnY80J66-r-kTZsKFWHmVrvezTjA1OJSad7TDnIlAVgLwE8aae390/exec';

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

  // Hero phone carousel for mobile
  const heroPhones = document.querySelector('.hero-phones');
  const phones = document.querySelectorAll('.hero-phone');
  const dots = document.querySelectorAll('.carousel-dot');

  if (heroPhones && phones.length > 0 && dots.length > 0) {
    let currentSlide = 0;
    let autoPlayInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    function isMobile() {
      return window.innerWidth <= 900;
    }

    function showSlide(index) {
      if (!isMobile()) return;

      phones.forEach((phone, i) => {
        phone.classList.remove('carousel-active');
        dots[i].classList.remove('active');
      });

      phones[index].classList.add('carousel-active');
      dots[index].classList.add('active');
      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % phones.length;
      showSlide(next);
    }

    function prevSlide() {
      const prev = (currentSlide - 1 + phones.length) % phones.length;
      showSlide(prev);
    }

    function startAutoPlay() {
      if (isMobile()) {
        autoPlayInterval = setInterval(nextSlide, 3000);
      }
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    // Initialize carousel on mobile
    function initCarousel() {
      if (isMobile()) {
        showSlide(0);
        startAutoPlay();
      } else {
        phones.forEach(phone => phone.classList.remove('carousel-active'));
        stopAutoPlay();
      }
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoPlay();
        showSlide(index);
        startAutoPlay();
      });
    });

    // Touch/swipe support
    heroPhones.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    heroPhones.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoPlay();
    }, { passive: true });

    // Handle resize
    window.addEventListener('resize', initCarousel);

    // Initialize
    initCarousel();
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
});
