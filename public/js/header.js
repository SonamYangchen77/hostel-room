document.addEventListener('DOMContentLoaded', () => {
  // Get current page path
  const currentPath = window.location.pathname;

  // Update active state
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (currentPath.startsWith(href) && href !== '/') {
      item.classList.add('active');
    }
  });

  // Handle logout
  const logoutButton = document.querySelector('.nav-item.logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/logout';
      }
    });
  }

  // Handle responsive menu
  function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }
  }

  // Initial check and event listener for window resize
  handleResize();
  window.addEventListener('resize', handleResize);
});