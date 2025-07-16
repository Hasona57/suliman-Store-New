function formatPrice(price) {
    return `${price.toLocaleString()} جنيه`;
}

function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartDisplay();
    showMessage('success', 'تم تفريغ السلة');
}

function updateCartDisplay() {
    try {
        updateCartCount();
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');

        if (!cartContainer || !cartSummary) {
            return; // We're not on the cart page
        }

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <h3>سلة التسوق فارغة</h3>
                    <p>لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
                    <a href="index.html#products" class="btn">
                        <i class="fas fa-shopping-bag"></i>
                        تسوق الآن
                    </a>
                </div>
            `;
            cartSummary.style.display = 'none';
            return;
        }

        cartContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <div class="cart-item-specs">
                        <span class="spec-item">
                            <i class="fas fa-ruler"></i>
                            المقاس: ${item.size}
                        </span>
                        <span class="spec-item">
                            <i class="fas fa-palette"></i>
                            اللون: ${item.color}
                        </span>
                    </div>
                    <div class="cart-item-price">
                        ${formatPrice(item.price * item.quantity)}
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item" onclick="removeItem('${item.id}')">
                            <i class="fas fa-trash-alt"></i>
                            حذف
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Update cart summary
        const subtotal = calculateTotal(cart);
        const shipping = 50; // Fixed shipping cost
        const total = subtotal + shipping;

        cartSummary.innerHTML = `
            <h3>ملخص الطلب</h3>
            <div class="summary-details">
                <div class="summary-row">
                    <span>عدد المنتجات:</span>
                    <span>${cart.reduce((acc, item) => acc + item.quantity, 0)} قطعة</span>
                </div>
                <div class="summary-row">
                    <span>المجموع الفرعي:</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span>رسوم الشحن:</span>
                    <span>${formatPrice(shipping)}</span>
                </div>
                <div class="summary-row">
                    <span>الإجمالي:</span>
                    <span>${formatPrice(total)}</span>
                </div>
            </div>
            
            <form id="checkoutForm" class="checkout-form">
                <div class="form-group">
                    <label for="name">الاسم بالكامل</label>
                    <input type="text" id="name" name="name" required 
                           placeholder="أدخل اسمك الكامل">
                </div>
                <div class="form-group">
                    <label for="email">البريد الإلكتروني</label>
                    <input type="email" id="email" name="email" required
                           placeholder="example@domain.com">
                </div>
                <div class="form-group">
                    <label for="phone">رقم الجوال</label>
                    <input type="tel" id="phone" name="phone" required
                           placeholder="مثال: 01234567890"
                           pattern="^(\\+20|0)?1[0125][0-9]{8}$">
                </div>
                <div class="form-group">
                    <label for="address">العنوان بالتفصيل</label>
                    <textarea id="address" name="address" rows="3" required
                              placeholder="أدخل عنوانك بالتفصيل مع ذكر المنطقة والمدينة"></textarea>
                </div>
                <div class="form-group">
                    <label for="notes">ملاحظات إضافية (اختياري)</label>
                    <textarea id="notes" name="notes" rows="2"
                              placeholder="أي ملاحظات خاصة بطلبك"></textarea>
                </div>
                <button type="submit" class="checkout-btn">
                    <i class="fas fa-lock"></i>
                    إتمام الطلب
                </button>
            </form>
        `;

        cartSummary.style.display = 'block';

        // Reinitialize AOS for new elements
        AOS.refresh();

    } catch (error) {
        console.error('Error updating cart display:', error);
    }
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Add animation class
        const quantityBtn = event.target.closest('.quantity-btn');
        if (quantityBtn) {
            quantityBtn.classList.add('clicked');
            setTimeout(() => quantityBtn.classList.remove('clicked'), 200);
        }

        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function removeItem(itemId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemElement = event.target.closest('.cart-item');
    
    if (itemElement) {
        itemElement.style.transform = 'translateX(100%)';
        itemElement.style.opacity = '0';
        
        setTimeout(() => {
            const updatedCart = cart.filter(item => item.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            updateCartDisplay();
        }, 300);
    }
}

function handleCheckout(e) {
    e.preventDefault();
    
    const form = e.target;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const notesInput = document.getElementById('notes');

    // Check if all required elements exist
    if (!nameInput || !emailInput || !phoneInput || !addressInput) {
        console.error('Required form fields are missing');
        showMessage('error', 'حدث خطأ في النموذج. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showMessage('error', 'سلة التسوق فارغة');
        return;
    }

    const formValues = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        notes: notesInput ? notesInput.value.trim() : 'لا توجد ملاحظات'
    };

    // Validate email format
    if (!formValues.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showMessage('error', 'يرجى إدخال بريد إلكتروني صحيح');
        return;
    }

    // Validate phone format (Egyptian numbers)
    if (!formValues.phone.match(/^(\+20|0)?1[0125][0-9]{8}$/)) {
        showMessage('error', 'يرجى إدخال رقم جوال مصري صحيح');
        return;
    }

    // Validate name
    if (formValues.name.length < 3) {
        showMessage('error', 'يرجى إدخال الاسم الكامل');
        return;
    }

    // Validate address
    if (formValues.address.length < 10) {
        showMessage('error', 'يرجى إدخال العنوان بالتفصيل');
        return;
    }

    // Show loading overlay
    showLoadingOverlay();
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
    }

    const subtotal = calculateTotal(cart);
    const shipping = 50;
    const total = subtotal + shipping;

    const orderNumber = generateOrderNumber();

    // Create the data structure that matches the new Google Apps Script expectations
    const orderData = {
        orderNumber: orderNumber,
        orderDate: new Date().toISOString(),
        customer: {
            name: formValues.name,
            email: formValues.email,
            phone: formValues.phone,
            address: formValues.address,
            notes: formValues.notes || 'لا توجد ملاحظات'
        },
        items: cart.map(item => ({
            title: item.title,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price
        })),
        totals: {
            subtotal: subtotal,
            shipping: shipping,
            total: total
        },
        status: 'pending',
        ownerEmail: 'hmmmma78@gmail.com'
    };

    // Log the data being sent
    console.log('Sending order data:', orderData);

    // Send data to Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbx2KoWLK7eYl51UP96Asz-hfBme4P42J4j5hTfmpbLfoSXO27vLsgw5NVIJwuXYiXbD/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Clear cart and show success
            localStorage.removeItem('cart');
            updateCartDisplay();
            
            hideLoadingOverlay();
            if (submitButton) {
                submitButton.disabled = false;
            }
            
            showMessage('success', 'تم إرسال طلبك بنجاح! سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.');
            
            // Redirect after success
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            throw new Error(data.error || 'Failed to submit order');
        }
    })
    .catch(error => {
        console.error('Error details:', error);
        hideLoadingOverlay();
        if (submitButton) {
            submitButton.disabled = false;
        }
        showMessage('error', 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.');
    });
}

// Generate a unique order number
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SO-${year}${month}${day}-${random}`;
}

// Show loading overlay function
function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        loadingOverlay.classList.add('active');
    }
}

// Hide loading overlay function
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
}

// Show message function with animation
function showMessage(type, text) {
    const messageElement = document.getElementById(`${type}Message`);
    if (messageElement) {
        const messageText = messageElement.querySelector('p');
        if (messageText) {
            messageText.textContent = text;
        }
        messageElement.style.display = 'flex';
        messageElement.style.opacity = '1';
        messageElement.classList.add('active');
        
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.classList.remove('active');
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 300);
        }, 5000);
    }
}

// Initialize cart display when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    
    // Add form submission handler
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formElements = {
                name: this.querySelector('#name'),
                email: this.querySelector('#email'),
                phone: this.querySelector('#phone'),
                address: this.querySelector('#address'),
                notes: this.querySelector('#notes')
            };

            // Check if all required elements exist
            if (!formElements.name || !formElements.email || !formElements.phone || !formElements.address) {
                console.error('Required form fields are missing');
                showMessage('error', 'حدث خطأ في النموذج. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
                return;
            }

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                showMessage('error', 'سلة التسوق فارغة');
                return;
            }

            const formValues = {
                name: formElements.name.value.trim(),
                email: formElements.email.value.trim(),
                phone: formElements.phone.value.trim(),
                address: formElements.address.value.trim(),
                notes: formElements.notes ? formElements.notes.value.trim() : 'لا توجد ملاحظات'
            };

            // Validate email format
            if (!formValues.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                showMessage('error', 'يرجى إدخال بريد إلكتروني صحيح');
                return;
            }

            // Validate phone format (Egyptian numbers)
            if (!formValues.phone.match(/^(\+20|0)?1[0125][0-9]{8}$/)) {
                showMessage('error', 'يرجى إدخال رقم جوال مصري صحيح');
                return;
            }

            // Validate name
            if (formValues.name.length < 3) {
                showMessage('error', 'يرجى إدخال الاسم الكامل');
                return;
            }

            // Validate address
            if (formValues.address.length < 10) {
                showMessage('error', 'يرجى إدخال العنوان بالتفصيل');
                return;
            }

            // Show loading overlay
            showLoadingOverlay();
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
            }

            const subtotal = calculateTotal(cart);
            const shipping = 50;
            const total = subtotal + shipping;

            const orderNumber = generateOrderNumber();

            // Create the data structure that matches the new Google Apps Script expectations
            const orderData = {
                orderNumber: orderNumber,
                orderDate: new Date().toISOString(),
                customer: {
                    name: formValues.name,
                    email: formValues.email,
                    phone: formValues.phone,
                    address: formValues.address,
                    notes: formValues.notes || 'لا توجد ملاحظات'
                },
                items: cart.map(item => ({
                    title: item.title,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    price: item.price
                })),
                totals: {
                    subtotal: subtotal,
                    shipping: shipping,
                    total: total
                },
                status: 'pending',
                ownerEmail: 'hmmmma78@gmail.com'
            };

            // Log the data being sent
            console.log('Sending order data:', orderData);

            // Send data to Google Apps Script
            fetch('https://script.google.com/macros/s/AKfycbx2KoWLK7eYl51UP96Asz-hfBme4P42J4j5hTfmpbLfoSXO27vLsgw5NVIJwuXYiXbD/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Clear cart and show success
                    localStorage.removeItem('cart');
                    updateCartDisplay();
                    
                    hideLoadingOverlay();
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                    
                    showMessage('success', 'تم إرسال طلبك بنجاح! سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.');
                    
                    // Redirect after success
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                } else {
                    throw new Error(data.error || 'Failed to submit order');
                }
            })
            .catch(error => {
                console.error('Error details:', error);
                hideLoadingOverlay();
                if (submitButton) {
                    submitButton.disabled = false;
                }
                showMessage('error', 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.');
            });
        });
    }
    
    // Add input validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const isValid = e.target.checkValidity();
            e.target.style.borderColor = isValid ? '' : '#dc3545';
        });
    }
}); 