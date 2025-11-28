document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    // Remove any existing event listeners by cloning (optional, but safer if mixed with inline)
    // Actually, we'll assume we cleaned up inline scripts or they don't exist.
    
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent bubbling
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && 
          !navLinks.contains(e.target) && 
          !navToggle.contains(e.target)) {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  // Dropdown toggle for mobile
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  
  dropdownParents.forEach(parent => {
    const trigger = parent.querySelector('a');
    const menu = parent.querySelector('.dropdown');
    
    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        // Check if we are in mobile view (matches CSS media query)
        if (window.innerWidth <= 768) {
          e.preventDefault(); // Prevent navigation for parent links in mobile
          
          // Close other open dropdowns (optional, mimics accordion)
          dropdownParents.forEach(otherParent => {
            if (otherParent !== parent) {
              const otherMenu = otherParent.querySelector('.dropdown');
              if (otherMenu) otherMenu.style.display = 'none';
            }
          });

          // Toggle current
          menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
        }
      });
    }
  });

  // Handle window resize to reset styles
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      if (navLinks) navLinks.classList.remove('open');
      if (navToggle) navToggle.classList.remove('open');
      document.querySelectorAll('.dropdown').forEach(d => d.style.display = '');
    }
  });
});
