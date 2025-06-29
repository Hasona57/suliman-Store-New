// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Format price in Egyptian Pounds
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

// Calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * parseInt(item.quantity)), 0);
}

// Update cart display
function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-items');
    const cartCount = document.getElementById('cartCount');
    
    // Update cart count
    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    if (!cart || cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>سلة التسوق فارغة</p>
                <a href="index.html#products" class="cta-button">تسوق الآن</a>
            </div>
        `;
        document.querySelector('.cart-summary').innerHTML = '';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <div class="cart-item-specs">
                    <span class="item-color">اللون: ${item.color}</span>
                    <span class="item-size">المقاس: ${item.size}</span>
                </div>
                <p class="cart-item-price">السعر: ${formatPrice(item.price)} جنيه</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <p class="cart-item-total">الإجمالي: ${formatPrice(item.price * item.quantity)} جنيه</p>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = calculateTotal();
    const shipping = 50; // Fixed shipping cost
    const total = subtotal + shipping;

    // Update cart summary with checkout form
    document.querySelector('.cart-summary').innerHTML = `
        <div class="cart-total">
            <span>المجموع الفرعي:</span>
            <span>${formatPrice(subtotal)} جنيه</span>
        </div>
        <div class="cart-total">
            <span>رسوم التوصيل:</span>
            <span>${formatPrice(shipping)} جنيه</span>
        </div>
        <div class="cart-total">
            <span>الإجمالي:</span>
            <span>${formatPrice(total)} جنيه</span>
        </div>
        <form id="checkoutForm" class="checkout-form">
            <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>رقم الهاتف</label>
                <input type="tel" name="phone" required>
            </div>
            <div class="form-group">
                <label>المدينة</label>
                <input type="text" name="city" required>
            </div>
            <div class="form-group">
                <label>العنوان</label>
                <textarea name="address" required></textarea>
            </div>
            <div class="form-group">
                <label>ملاحظات إضافية</label>
                <textarea name="notes"></textarea>
            </div>
            <button type="submit" class="checkout-btn">
                <i class="fas fa-lock"></i>
                إتمام الطلب
            </button>
        </form>
    `;

    // Attach submit event handler to the checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

// Handle checkout form submission
async function handleCheckout(event) {
    event.preventDefault();

    try {
        const form = event.target;

        // Get form data
        const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            city: form.city.value,
            address: form.address.value,
            notes: form.notes.value || 'لا توجد ملاحظات'
        };

        // Validate form data
        if (!formData.name || !formData.email || !formData.phone || !formData.city || !formData.address) {
            showMessage('error', 'الرجاء ملء جميع الحقول المطلوبة');
            return;
        }

        // Validate email format
        if (!isValidEmail(formData.email)) {
            showMessage('error', 'الرجاء إدخال بريد إلكتروني صحيح');
            return;
        }

        // Validate phone number (Egyptian format)
        if (!isValidPhone(formData.phone)) {
            showMessage('error', 'الرجاء إدخال رقم هاتف صحيح');
            return;
        }

        // Show loading overlay
        showLoading('جاري إرسال الطلب...');

        // Create order summary
        const subtotal = calculateTotal();
        const shipping = 50;
        const total = subtotal + shipping;

        // Format items list for email
        const itemsList = cart.map(item => 
            `${item.title}
المقاس: ${item.size}
اللون: ${item.color}
الكمية: ${item.quantity}
السعر: ${formatPrice(item.price)} جنيه
الإجمالي: ${formatPrice(item.price * item.quantity)} جنيه`
        ).join('\n\n');

        const orderData = {
            customerInfo: formData,
            orderDetails: {
                itemsList: itemsList,
                subtotal: formatPrice(subtotal),
                shipping: formatPrice(shipping),
                total: formatPrice(total)
            },
            ownerEmail: 'hmmmma78@gmail.com' // Replace with your email
        };

        // Send to Google Apps Script
        const response = await fetch('https://script.google.com/macros/s/AKfycbw35ozpWkKg_NTT0X61wdD-reC5OpCymKYJ-KtObwnl1bFdH70cKjya3W-t_W4bClWu/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        // Handle success
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('cart');
        cart = [];

        // Hide loading and show success
        hideLoading();
        showOrderSuccess({
            orderId: Date.now().toString(),
            customerInfo: formData,
            orderDetails: {
                total: formatPrice(total)
            }
        });

        // Reset form
        form.reset();

        // Update cart display
        updateCartDisplay();

        // Show success message
        showMessage('success', 'تم إرسال الطلب بنجاح! سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.');

    } catch (error) {
        console.error('Error during checkout:', error);
        hideLoading();
        showMessage('error', 'عذراً، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    }
}

// Helper functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^(01)[0-9]{9}$/.test(phone.replace(/\s/g, ''));
}

function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function showLoading(message = 'جاري معالجة الطلب...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">${message}</div>
    `;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function showOrderSuccess(orderSummary) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>تم تقديم طلبك بنجاح!</h2>
            <p>رقم الطلب: ${orderSummary.orderId}</p>
            <p>سيتم التواصل معك قريباً لتأكيد الطلب.</p>
            <div class="order-summary">
                <h3>ملخص الطلب</h3>
                <p>الاسم: ${orderSummary.customerInfo.name}</p>
                <p>رقم الهاتف: ${orderSummary.customerInfo.phone}</p>
                <p>العنوان: ${orderSummary.customerInfo.address}</p>
                <p>المدينة: ${orderSummary.customerInfo.city}</p>
                <p>الإجمالي: ${orderSummary.orderDetails.total} جنيه</p>
            </div>
            <button onclick="window.location.href='index.html'" class="modal-btn">
                <i class="fas fa-home"></i>
                العودة للرئيسية
            </button>
        </div>
    `;
    document.body.appendChild(modal);

    // Add click event to close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            window.location.href = 'index.html';
        }
    });
}

// Update item quantity
function updateQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const newQuantity = cart[itemIndex].quantity + change;
        if (newQuantity > 0 && newQuantity <= 10) {
            cart[itemIndex].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Initialize cart display
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
}); 