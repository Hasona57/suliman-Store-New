// Get product ID from URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1'; // Default to first product if no ID specified
}

// Load product details
function loadProductDetails() {
    const productId = getProductIdFromUrl();
    const product = window.products[productId];
    
    if (!product) {
        console.error('Product not found');
        return;
    }

    // Update breadcrumb
    document.getElementById('productBreadcrumb').textContent = product.title;

    // Update product title and price
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productPrice').textContent = `${product.price} جنيه`;

    // Update product description
    document.getElementById('productDescription').textContent = product.description;

    // Load product features
    const featuresList = document.getElementById('productFeatures');
    featuresList.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');

    // Load product images
    loadProductImages(product.images);
}

// Load product images
function loadProductImages(images) {
    const mainImage = document.getElementById('mainImage');
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    
    // Set main image
    mainImage.src = images[0];
    mainImage.alt = 'صورة المنتج';

    // Create thumbnails
    thumbnailGrid.innerHTML = images.map((image, index) => `
        <img src="${image}" 
             alt="صورة مصغرة ${index + 1}" 
             class="thumbnail ${index === 0 ? 'active' : ''}"
             onclick="updateMainImage(this.src, this)"
        >
    `).join('');
}

// Update main image when clicking thumbnails
function updateMainImage(src, thumbnail) {
    document.getElementById('mainImage').src = src;
    // Update active state
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Handle size selection
const sizeSelector = document.getElementById('sizeSelector');
if (sizeSelector) {
    sizeSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('size-option')) {
            document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

// Add to cart functionality
const addToCartBtn = document.getElementById('addToCartBtn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const productId = getProductIdFromUrl();
        addToCart(productId);
    });
}

function addToCart(productId) {
    const cartCount = document.getElementById('cartCount');
    const currentCount = parseInt(cartCount.textContent);
    cartCount.textContent = currentCount + 1;
    
    // Add animation class
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.classList.add('added');
    setTimeout(() => addToCartBtn.classList.remove('added'), 1000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
}); 