document.addEventListener('DOMContentLoaded', () => {
    // Handle user dropdown
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) {
        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // Update cart count
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}); 