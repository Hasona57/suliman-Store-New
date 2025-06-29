// Menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidemenu = document.getElementById('sidemenu');
    const toggleBtn = document.getElementById('toggleBtn');
    const searchContainer = document.getElementById('searchContainer');
    const cartCount = document.getElementById('cartCount');
    
    // Initialize cart count from localStorage
    function updateCartCount() {
        const count = localStorage.getItem('cartCount') || '0';
        cartCount.textContent = count;
    }
    updateCartCount();

    // Function to update cart count
    window.updateCart = function(change) {
        const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
        const newCount = Math.max(0, currentCount + change);
        localStorage.setItem('cartCount', newCount.toString());
        updateCartCount();
    };
    
    // Toggle menu
    function toggleMenu() {
        sidemenu.classList.toggle('active');
        toggleBtn.classList.toggle('active');
    }

    // Initialize menu functionality
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu and search when clicking outside
    document.addEventListener('click', function(e) {
        const isClickInsideMenu = sidemenu.contains(e.target);
        const isClickOnToggleBtn = toggleBtn.contains(e.target);
        const isClickInsideSearch = searchContainer.contains(e.target);
        const isClickOnSearchBtn = e.target.closest('.search-toggle-btn');

        // Close menu if click is outside menu and toggle button
        if (!isClickInsideMenu && !isClickOnToggleBtn) {
            sidemenu.classList.remove('active');
            toggleBtn.classList.remove('active');
        }

        // Close search if click is outside search and search button
        if (!isClickInsideSearch && !isClickOnSearchBtn) {
            searchContainer.classList.remove('active');
        }
    });

    // Prevent clicks inside menu and search from closing them
    sidemenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    searchContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Close menu when clicking on a menu link
    const menuLinks = sidemenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidemenu.classList.remove('active');
            toggleBtn.classList.remove('active');
        });
    });
}); 