/* ==========================================================================
   JIKAJIKA MEDIA (PTY) LTD - MAIN JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Glass Navbar on Scroll
  const siteHeader = document.querySelector('.site-header');
  const updateHeaderScroll = () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      document.body.classList.toggle('mobile-menu-active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (document.body.classList.contains('mobile-menu-active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Close menu when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('mobile-menu-active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // 3. Scroll Reveal Animations with Intersection Observer
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 4. Animated Number Counters for Stats
  const statNumbers = document.querySelectorAll('.stat-counter');
  let statsCounted = false;

  const runCounterAnimation = () => {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = prefix + target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = prefix + Math.floor(current) + suffix;
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.hero-stats-row, .stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsCounted) {
        statsCounted = true;
        runCounterAnimation();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  } else {
    runCounterAnimation();
  }

  // 5. Interactive Service Checkbox Cards in Quote Form
  const serviceCheckboxes = document.querySelectorAll('.service-checkbox-card input[type="checkbox"]');
  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const parentCard = cb.closest('.service-checkbox-card');
      if (cb.checked) {
        parentCard?.classList.add('checked');
      } else {
        parentCard?.classList.remove('checked');
      }
    });
  });

  // 6. Interactive Quote Request Form & WhatsApp Message Generator
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('quoteName')?.value || 'Client';
      const company = document.getElementById('quoteCompany')?.value || 'N/A';
      const email = document.getElementById('quoteEmail')?.value || '';
      const phone = document.getElementById('quotePhone')?.value || '';
      const eventDate = document.getElementById('quoteDate')?.value || 'TBD';
      const eventType = document.getElementById('quoteEventType')?.value || 'General Event';
      const notes = document.getElementById('quoteNotes')?.value || '';

      const selectedServices = [];
      document.querySelectorAll('.service-checkbox-card input[type="checkbox"]:checked').forEach(input => {
        selectedServices.push(input.value);
      });

      const servicesText = selectedServices.length ? selectedServices.join(', ') : 'Custom Package';

      // Build WhatsApp pre-filled text
      const waMessage = `*New Website Inquiry - Jikajika Media*%0A%0A` +
        `*Name:* ${encodeURIComponent(fullName)}%0A` +
        `*Company/Organization:* ${encodeURIComponent(company)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Email:* ${encodeURIComponent(email)}%0A` +
        `*Event Type:* ${encodeURIComponent(eventType)}%0A` +
        `*Event Date:* ${encodeURIComponent(eventDate)}%0A` +
        `*Requested Services:* ${encodeURIComponent(servicesText)}%0A` +
        `*Additional Details:* ${encodeURIComponent(notes)}%0A%0A` +
        `_Sent via Jikajika Media Official Website_`;

      const waUrl = `https://wa.me/27735660267?text=${waMessage}`;

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');

      // Feedback alert
      alert('Thank you! Redirecting to WhatsApp to send your quote request directly to the Jikajika Media production team.');
    });
  }

  // 7. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = siteHeader ? siteHeader.offsetHeight : 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
