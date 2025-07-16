// Get product ID from URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) return 'classic1';

    if (window.products[id]) {
        return id;
    }

    const idMap = {
        '1': 'classic1',
        '2': 'embroidered1',
        '3': 'casual1',
        '4': 'luxury1',
        '5': 'modern1',
        '6': 'evening1',
        '7': 'sport1',
        '8': 'premium1',
        '9': 'ramadan1',
        '10': 'wedding1',
        '11': 'office1',
        '12': 'travel1'
    };

    return idMap[id] || 'classic1';
}

function loadProductDetails() {
    const productId = getProductIdFromUrl();
    console.log('Loading product with ID:', productId);
    console.log('Available products:', window.products);
    
    const product = window.products[productId];
    
    if (!product) {
        console.error('المنتج غير موجود');
        return;
    }

    console.log('Product details:', product);

    // Update breadcrumb
    const breadcrumb = document.getElementById('productBreadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = product.title;
    }

    // Update product title and price
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
        productTitle.textContent = product.title;
    }

    const productPrice = document.getElementById('productPrice');
    if (productPrice) {
        productPrice.textContent = `${product.price} جنيه`;
    }

    // Update product description
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.textContent = product.description;
    }

    // Load product features
    const featuresList = document.getElementById('productFeatures');
    if (featuresList && product.features && Array.isArray(product.features)) {
        featuresList.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    }

    // Load product images
    loadProductImages(product.images, product.title);

    // Update color selector
    const colorSelector = document.getElementById('colorSelector');
    console.log('Color selector element:', colorSelector);
    console.log('Product colors:', product.colors);
    
    if (colorSelector && product.colors && Array.isArray(product.colors)) {
        colorSelector.innerHTML = '';
        console.log('Creating color options...');

        // Create color options
        product.colors.forEach(color => {
            console.log('Creating color option for:', color);
            const button = document.createElement('button');
            button.className = 'color-option';
            button.setAttribute('data-color', color);
            
            const tooltip = document.createElement('span');
            tooltip.className = 'color-name-tooltip';
            tooltip.textContent = color;
            button.appendChild(tooltip);

            colorSelector.appendChild(button);
            console.log('Added color option:', color);
        });
        
        console.log('Final color selector HTML:', colorSelector.innerHTML);
    } else {
        console.error('Color selector setup failed:',
            'colorSelector exists:', !!colorSelector,
            'product.colors exists:', !!product.colors,
            'product.colors is array:', Array.isArray(product.colors)
        );
    }
}

function loadProductImages(images, title) {
    const mainImage = document.getElementById('mainImage');
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    
    if (mainImage && images && images.length > 0) {
        mainImage.src = images[0];
        mainImage.alt = title;
    }

    if (thumbnailGrid && images && Array.isArray(images)) {
        thumbnailGrid.innerHTML = images.map((image, index) => `
            <img src="${image}" 
                 alt="${title} - صورة ${index + 1}" 
                 class="thumbnail ${index === 0 ? 'active' : ''}"
                 onclick="updateMainImage(this.src, this)"
            >
        `).join('');
    }
}

function updateMainImage(src, thumbnail) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = src;
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
    }
}

// Handle color selection
const colorSelector = document.getElementById('colorSelector');
if (colorSelector) {
    colorSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option')) {
            document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
}

// Handle size selection
const sizeSelector = document.getElementById('sizeSelector');
if (sizeSelector) {
    sizeSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('size-option')) {
            document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
}

// Add to cart functionality
const addToCartBtn = document.getElementById('addToCartBtn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const selectedSize = document.querySelector('.size-option.selected');
        const selectedColor = document.querySelector('.color-option.selected');
        
        if (!selectedSize) {
            alert('الرجاء اختيار المقاس');
            return;
        }
        
        if (!selectedColor) {
            alert('الرجاء اختيار اللون');
            return;
        }

        const productId = getProductIdFromUrl();
        const product = window.products[productId];

        if (!product) {
            alert('حدث خطأ. الرجاء المحاولة مرة أخرى.');
            return;
        }

        const cartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: window.quantity || 1,
            size: selectedSize.getAttribute('data-size'),
            color: selectedColor.getAttribute('data-color'),
            image: product.images[0]
        };

        // Add to cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }

        // Show success animation
        addToCartBtn.classList.add('added');
        addToCartBtn.innerHTML = `<i class="fas fa-check"></i> <span>تمت الإضافة للسلة</span>`;
        
        setTimeout(() => {
            addToCartBtn.classList.remove('added');
            addToCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> <span>أضف إلى السلة</span>`;
        }, 2000);
    });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', loadProductDetails); 