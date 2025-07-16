document.addEventListener('DOMContentLoaded', function() {
    const sidemenu = document.getElementById('sidemenu');
    const toggleBtn = document.getElementById('toggleBtn');
    const searchContainer = document.getElementById('searchContainer');
    const cartCount = document.getElementById('cartCount');
    
    if (!sidemenu || !toggleBtn) return;
    
    function updateCartCount() {
        if (!cartCount) return;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
    updateCartCount();

    window.updateCart = updateCartCount;

    toggleBtn.addEventListener('click', () => {
        sidemenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!sidemenu.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidemenu.classList.remove('active');
        }
    });
}); 