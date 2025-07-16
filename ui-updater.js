// Initialize toast container
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
});

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartCount) {
        // Count total items including quantities
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

// Add item to cart
function addToCart(item) {
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Ensure item has a quantity
    if (!item.quantity) {
        item.quantity = 1;
    }
    
    // Add new item
    cart.push(item);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    // Show success message
    const message = window.langManager.translate('addedToCart') || 'تمت الإضافة إلى السلة';
    showToast(message, 'success');
    
    // Animate cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.classList.add('bounce');
        setTimeout(() => cartBtn.classList.remove('bounce'), 1000);
    }
}

// Make functions globally available
window.showToast = showToast;
window.updateCartCount = updateCartCount;
window.addToCart = addToCart;

// Initialize
document.addEventListener('DOMContentLoaded', updateCartCount); 