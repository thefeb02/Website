document.addEventListener('DOMContentLoaded', function() {
  // Theme switching functionality
  // Page loader - hide after full page load
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader) {
    window.addEventListener('load', () => {
      pageLoader.classList.add('hidden');
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 600);
    });
  }

  // Handle link clicks
  document.addEventListener('click', function(e) {
    // Find the closest anchor tag from the click target
    let target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentNode;
      if (target === document.body) return; // Not inside an anchor
    }
    
    // If it's an external link (not starting with # and not a social media link)
    if (target && target.href) {
      const isInternalLink = target.getAttribute('href').startsWith('#');
      const isSocialLink = target.closest('.social-links') || target.closest('.hero-social');
      
      // Only handle external links that are not social media links
      if (target.href.startsWith('http') && !isInternalLink && !isSocialLink) {
        e.preventDefault();
        window.open(target.href, '_blank', 'noopener,noreferrer');
      }
    }
  }, true); // Use capture phase to ensure we catch the event first
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = {
    light: 'fa-moon',
    dark: 'fa-sun'
  };
  
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon('light');
  }
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Toggle theme function
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    updateThemeIcon(newTheme);
  }
  
  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    
    // Remove all icon classes
    icon.className = 'fas';
    
    // Add the appropriate icon class
    icon.classList.add(theme === 'dark' ? themeIcon.light : themeIcon.dark);
    
    // Toggle visibility of icons if both are present
    const allIcons = themeToggle.querySelectorAll('i');
    allIcons.forEach(i => {
      i.style.display = 'none';
    });
    icon.style.display = 'inline-block';
  }

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll <= 0) {
      navbar.classList.remove('scrolled');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scrolling down & past 100px
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
      navbar.classList.add('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Smooth scrolling for anchor links
  function scrollToTarget(targetId) {
    try {
      if (!targetId || targetId === '#') return;
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 80; // Default to 80px if header not found
      const offset = 20; // Additional offset for better spacing
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    } catch (error) {
      console.error('Smooth scrolling error:', error);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        scrollToTarget(href);
      }
    });
  });
  // Scroll to hash on page load if present
  if (window.location.hash) {
    setTimeout(() => {
      scrollToTarget(window.location.hash);
    }, 100);
  }

  // Ensure all external links open in a new tab
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    // Do not preventDefault on these links
  });


  // Typing effect
  const texts = ['Frontend Developer'];
  let count = 0;
  
  let isDeleting = false;
  let typingSpeed = 150;
  let charIndex = 0;

  function type() {
    const typingText = document.querySelector('.typing-text');
    const currentText = texts[count];
    
    if (isDeleting) {
      // Remove character
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 100;
      
      if (charIndex === 0) {
        isDeleting = false;
        count = (count + 1) % texts.length;
        typingSpeed = 500; // Pause before typing next word
      }
    } else {
      // Add character
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 150;
      
      if (charIndex === currentText.length) {
        typingSpeed = 2000; // Pause at end of word
        isDeleting = true;
      }
    }
    
    setTimeout(type, typingSpeed);
  }
  
  // Start typing effect after a delay
  setTimeout(type, 1000);

  // Intersection Observer for scroll animations
  const animateOnScroll = (elements, className) => {
    if (!elements || elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => observer.observe(element));
  };

  // Initialize animations
  const fadeElements = document.querySelectorAll('.fade-in');
  const slideLeftElements = document.querySelectorAll('.slide-in-left');
  const slideRightElements = document.querySelectorAll('.slide-in-right');
  
  animateOnScroll(fadeElements, 'visible');
  animateOnScroll(slideLeftElements, 'visible');
  animateOnScroll(slideRightElements, 'visible');
  
  // Add hover effect to project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
  
  // Add animation to hero section elements
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      heroContent.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 300);
  }
  
  document.querySelector('.character-container').classList.add('fade-in');
  document.querySelector('.intro-text').classList.add('fade-in');
  document.querySelectorAll('.social-icon').forEach(icon => {
      icon.classList.add('slide-in-right');
  });
  
  // Scroll animations
  const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  
  // Function to check if element is in viewport
  function checkIfInView() {
      const windowHeight = window.innerHeight;
      const windowTopPosition = window.scrollY;
      const windowBottomPosition = windowTopPosition + windowHeight;
      
      animateElements.forEach(element => {
          const elementHeight = element.offsetHeight;
          const elementTopPosition = element.offsetTop;
          const elementBottomPosition = elementTopPosition + elementHeight;
          
          // Check if element is in viewport
          if (
              (elementBottomPosition >= windowTopPosition) && 
              (elementTopPosition <= windowBottomPosition)
          ) {
              element.classList.add('visible');
          }
      });
  }
  
  // Run once on page load
  checkIfInView();
  
  // Run on scroll
  window.addEventListener('scroll', checkIfInView);

  // Skills section animation
  const skillsSection = document.querySelector('.skills-section');
  const skillItems = document.querySelectorAll('.skill-item');
  let skillsAnimated = false;

  function animateSkills() {
    if (!skillsSection || skillsAnimated) return;
    
    const rect = skillsSection.getBoundingClientRect();
    const isInView = (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );

    if (isInView) {
      skillsAnimated = true;
      
      // Animate each skill item with a slight delay between them
      skillItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
          
          // Animate progress bars
          const progressBar = item.querySelector('.skill-progress');
          if (progressBar) {
            const width = progressBar.style.width;
            progressBar.style.width = '0';
            
            // Small delay before starting the progress animation
            setTimeout(() => {
              progressBar.style.transition = 'width 1.5s ease-in-out';
              progressBar.style.width = width;
            }, 200);
          }
        }, index * 100); // 100ms delay between each skill
      });
    }
  }

  // Initial check in case skills are already in view
  document.addEventListener('DOMContentLoaded', animateSkills);
  
  // Check on scroll

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(function(error) {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
  window.addEventListener('scroll', animateSkills);

  // Make all initial elements visible after a short delay
  setTimeout(() => {
      document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
          el.classList.add('visible');
      });
  }, 300);
  
  // Highlight active nav link based on scroll position
  window.addEventListener('scroll', function() {
      const sections = document.querySelectorAll('main');
      const navLinks = document.querySelectorAll('.nav-link');
      
      let currentSection = '';
      
      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (window.scrollY >= (sectionTop - 100)) {
              currentSection = section.getAttribute('id');
          }
      });
      
      navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSection}`) {
              link.classList.add('active');
          }
      });
  });
  
  // Character hover animation enhancement
  const character = document.querySelector('.character');
  const glowCircle = document.querySelector('.glow-circle');
  
  document.addEventListener('mousemove', function(e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const characterRect = character.getBoundingClientRect();
      const characterCenterX = characterRect.left + characterRect.width / 2;
      const characterCenterY = characterRect.top + characterRect.height / 2;
      
      const deltaX = (mouseX - characterCenterX) / 30;
      const deltaY = (mouseY - characterCenterY) / 30;
      
      // Limit the movement
      const limitedDeltaX = Math.max(-10, Math.min(10, deltaX));
      const limitedDeltaY = Math.max(-10, Math.min(10, deltaY));
      
      // Apply subtle movement to character
      character.style.transform = `translate(calc(-50% + ${limitedDeltaX}px), calc(-50% + ${limitedDeltaY}px))`;
      
      // Move glow circle slightly in opposite direction for parallax effect
      glowCircle.style.transform = `translate(calc(-50% - ${limitedDeltaX * 0.5}px), calc(-50% - ${limitedDeltaY * 0.5}px))`;
  });
});
// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Toggle mobile menu
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', 
        mobileMenuBtn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
});

// Close mobile menu when clicking a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
});

// Add active class to current section in viewport
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${id}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // If it starts with "#" and has a valid target on the page
    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        scrollToTarget(href);
      }
    }
    // Else: Do nothing, allow external link to open normally
  });
});




// Wait for both DOM and all assets to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure all elements are available
  setTimeout(function() {
      console.log('DOM fully loaded, initializing mobile menu...');
      
      // Mobile menu elements - using more specific selectors
      const mobileMenuBtn = document.querySelector('button.mobile-menu-btn');
      const navLinks = document.querySelector('nav .nav-links');
      const navLinksList = navLinks ? navLinks.querySelector('ul') : null;
      const body = document.body;
      
      // Check if elements exist and are visible
      if (!mobileMenuBtn || !navLinks) {
          console.error('Mobile menu elements not found or not visible:', { 
              mobileMenuBtn: !!mobileMenuBtn, 
              navLinks: !!navLinks 
          });
          return;
      }
      
      // Force display for mobile menu button in case it's hidden by CSS
      if (window.innerWidth <= 768) {
          mobileMenuBtn.style.display = 'flex';
      }
      
      console.log('Mobile menu elements found, adding event listeners...');
  
  // Toggle mobile menu
  function toggleMobileMenu() {
      try {
          console.log('Toggling mobile menu...');
          const wasOpen = mobileMenuBtn.classList.contains('active');
          
          // Toggle active class on button and nav
          mobileMenuBtn.classList.toggle('active');
          navLinks.classList.toggle('active');
          body.classList.toggle('menu-open');
          
          // Update ARIA attributes for accessibility
          const isExpanded = !wasOpen;
          mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
          navLinks.setAttribute('aria-hidden', !isExpanded);
          
          // Set focus to first menu item when opening
          if (isExpanded && navLinksList) {
              const firstLink = navLinksList.querySelector('a');
              if (firstLink) {
                  setTimeout(() => firstLink.focus(), 100);
              }
          }
          
          console.log('Menu toggled:', { isExpanded });
      } catch (error) {
          console.error('Error toggling mobile menu:', error);
      }
  }
  
  // Close menu when clicking outside
  function closeMenuOnClickOutside(event) {
      if (!mobileMenuBtn.classList.contains('active')) return;
      
      const isClickInside = navLinks.contains(event.target) || mobileMenuBtn.contains(event.target);
      
      if (!isClickInside) {
          console.log('Click outside detected, closing menu');
          toggleMobileMenu();
      }
  }
  
  // Close menu when clicking on a nav link
  function closeMenuOnNavClick(event) {
      // Only proceed if clicking on a link directly or its child elements
      const link = event.target.closest('a');
      if (link) {
          console.log('Nav link clicked, closing menu');
          // Small delay to allow the link to be followed
          setTimeout(toggleMobileMenu, 100);
      }
  }
  
  // Close menu when pressing Escape key
  function handleKeyDown(event) {
      if (event.key === 'Escape' && mobileMenuBtn.classList.contains('active')) {
          console.log('Escape key pressed, closing menu');
          toggleMobileMenu();
          mobileMenuBtn.focus();
      }
  }
  
  // Initialize ARIA attributes with more specific settings
  function initAria() {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
      mobileMenuBtn.setAttribute('aria-controls', 'nav-links');
      navLinks.setAttribute('aria-hidden', 'true');
      navLinks.setAttribute('role', 'navigation');
      navLinks.id = 'nav-links';
      
      // Ensure proper tabindex for accessibility
      const navItems = navLinks.querySelectorAll('a');
      navItems.forEach(item => {
          item.setAttribute('tabindex', '-1');
      });
  }
  
  // Initialize the menu
  function initMenu() {
      // Initialize ARIA attributes
      initAria();
      
      // Event listeners
      try {
          console.log('Adding click event to mobile menu button...');
          
          // Remove any existing event listeners to prevent duplicates
          mobileMenuBtn.removeEventListener('click', handleMenuButtonClick);
          navLinks.removeEventListener('click', closeMenuOnNavClick);
          document.removeEventListener('click', closeMenuOnClickOutside);
          document.removeEventListener('keydown', handleKeyDown);
          
          // Add new event listeners
          mobileMenuBtn.addEventListener('click', handleMenuButtonClick);
          navLinks.addEventListener('click', closeMenuOnNavClick);
          document.addEventListener('click', closeMenuOnClickOutside);
          document.addEventListener('keydown', handleKeyDown);
          
          // Close menu when resizing to desktop
          let resizeTimer;
          window.addEventListener('resize', function() {
              clearTimeout(resizeTimer);
              resizeTimer = setTimeout(function() {
                  if (window.innerWidth > 768 && mobileMenuBtn.classList.contains('active')) {
                      console.log('Window resized to desktop, closing menu');
                      toggleMobileMenu();
                  }
                  
                  // Re-initialize if needed when switching between mobile/desktop
                  if ((window.innerWidth <= 768 && mobileMenuBtn.style.display === 'none') || 
                      (window.innerWidth > 768 && mobileMenuBtn.style.display === 'flex')) {
                      initMenu();
                  }
              }, 250);
          });
          
          console.log('Mobile menu initialization complete');
      } catch (error) {
          console.error('Error initializing mobile menu event listeners:', error);
      }
  }
  
  // Handle menu button click
  function handleMenuButtonClick(event) {
      try {
          event.stopPropagation();
          event.preventDefault();
          toggleMobileMenu();
      } catch (error) {
          console.error('Error handling menu button click:', error);
      }
  }
  
  // Initialize the menu
  initMenu();
  
  }); // End of setTimeout
}); // End of DOMContentLoaded
