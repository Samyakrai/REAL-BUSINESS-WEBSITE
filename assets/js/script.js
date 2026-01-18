// Basic Navigation and dynamic logic

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();

    // Check if we are on the registration page
    if (window.location.pathname.includes('register.html')) {
        loadCourseDetails();
    }
});

// Update Navigation based on Auth State
function updateNavigation() {
    const userEmail = localStorage.getItem('userEmail');
    const navLinks = document.querySelector('.nav-links');
    const currentPath = window.location.pathname;

    if (navLinks) {
        // Remove existing Login/Profile links
        const existingAuthLink = navLinks.querySelector('.auth-link');
        if (existingAuthLink) existingAuthLink.remove();

        const li = document.createElement('li');
        li.className = 'auth-link';

        if (userEmail) {
            const isProfile = currentPath.includes('page5.html');
            li.innerHTML = `<a href="page5.html" class="${isProfile ? 'highlight' : ''}">Profile</a>`;
        } else {
            const isLogin = currentPath.includes('login.html');
            li.innerHTML = `<a href="login.html" class="${isLogin ? 'highlight' : ''}">Login</a>`;
        }
        navLinks.appendChild(li);
    }
}

// Login Logic
// Login Logic
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Open Login: Allow any credentials
    if (email && password) {
        localStorage.setItem('userEmail', email);
        alert('Login Successful!');
        window.location.href = 'index.html';
    } else {
        alert('Please enter both email and password.');
    }
}

// Logout Logic
function logout() {
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Function to handle Add to Cart from courses.html
function addToCart(courseName, price) {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        alert('Please login to add courses to your cart.');
        window.location.href = 'login.html';
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart_' + userEmail) || '[]');

    // Check if already in cart
    if (cart.some(item => item.course === courseName)) {
        alert('This course is already in your cart!');
        return;
    }

    cart.push({ course: courseName, price: price });
    localStorage.setItem('cart_' + userEmail, JSON.stringify(cart));
    alert(`${courseName} added to cart!`);
}

// Function to load course details on register.html (Legacy/Direct Buy support)
function loadCourseDetails() {
    const courseName = localStorage.getItem('selectedCourseName');
    const coursePrice = localStorage.getItem('selectedCoursePrice');

    const nameDisplay = document.getElementById('display-course-name');
    const feeDisplay = document.getElementById('display-course-fee');

    if (courseName && coursePrice) {
        if (nameDisplay) nameDisplay.innerText = courseName;
        if (feeDisplay) feeDisplay.innerText = '₹ ' + coursePrice;
    } else {
        if (nameDisplay) nameDisplay.innerText = 'No Course Selected';
        if (feeDisplay) feeDisplay.innerText = '-';
    }
}

// Handle Registration Form Submission (Used for Final Payment)
function handleRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const dob = document.getElementById('dob').value;

    const courseName = localStorage.getItem('selectedCourseName');
    // Check if a discounted price was applied, otherwise use original
    let finalPrice = localStorage.getItem('finalPaymentPrice');

    if (!finalPrice) {
        finalPrice = localStorage.getItem('selectedCoursePrice');
    }

    // Basic required check
    if (!courseName) {
        alert('No course selected for payment.');
        window.location.href = 'page5.html'; // Go back to profile/cart
        return;
    }

    if (name && phone && email && dob) {
        const loggedInUser = localStorage.getItem('userEmail');

        // If logged in, save purchase and remove from cart
        if (loggedInUser) {
            savePurchase(loggedInUser, courseName, finalPrice);
            removeFromCart(loggedInUser, courseName);
        }

        alert(`Payment Successful!\n\nRegistered for: ${courseName}\nFinal Amount Paid: ₹ ${finalPrice}\n\nWelcome to RISE UP!`);

        // Clear selection and discount
        localStorage.removeItem('selectedCourseName');
        localStorage.removeItem('selectedCoursePrice');
        localStorage.removeItem('finalPaymentPrice');

        if (loggedInUser) {
            window.location.href = 'page5.html';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        alert('Please fill in all details.');
    }
}

// Coupon Logic
function applyCoupon() {
    const codeInput = document.getElementById('coupon-code');
    const msg = document.getElementById('coupon-msg');
    const displayFee = document.getElementById('display-course-fee');

    const originalPrice = parseFloat(localStorage.getItem('selectedCoursePrice'));

    if (!originalPrice) {
        msg.style.color = 'red';
        msg.innerText = "No course selected.";
        return;
    }

    if (codeInput.value.trim().toUpperCase() === 'NEWYEAR26') {
        const discountPromise = (originalPrice * 0.30);
        const newPrice = Math.round(originalPrice - discountPromise);

        // Update Display
        displayFee.innerHTML = `<span style="text-decoration: line-through; color: #888;">₹ ${originalPrice}</span> <span style="color: #4CAF50;">₹ ${newPrice}</span>`;
        msg.style.color = '#4CAF50';
        msg.innerText = "Coupon Applied! 30% Discount.";

        // Save for payment handler
        localStorage.setItem('finalPaymentPrice', newPrice);
    } else {
        msg.style.color = 'red';
        msg.innerText = "Invalid Coupon Code.";

        // Reset
        displayFee.innerText = '₹ ' + originalPrice;
        localStorage.removeItem('finalPaymentPrice');
    }
}

// Save Purchase Helper
function savePurchase(userEmail, courseName, price) {
    let purchases = JSON.parse(localStorage.getItem('purchases_' + userEmail) || '[]');
    // Avoid duplicate purchases
    if (!purchases.some(p => p.course === courseName)) {
        purchases.push({
            course: courseName,
            price: price,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('purchases_' + userEmail, JSON.stringify(purchases));
    }
}

// Remove from Cart Helper
function removeFromCart(userEmail, courseName) {
    let cart = JSON.parse(localStorage.getItem('cart_' + userEmail) || '[]');
    cart = cart.filter(item => item.course !== courseName);
    localStorage.setItem('cart_' + userEmail, JSON.stringify(cart));
}

// Load Profile Data (Cart + Purchases)
function loadProfile() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    document.getElementById('user-email-display').innerText = userEmail;

    // Load Cart
    const cartList = document.getElementById('cart-list');
    const cart = JSON.parse(localStorage.getItem('cart_' + userEmail) || '[]');

    if (cart.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        let cartHtml = '<div class="purchase-grid" style="display: grid; gap: 20px;">';
        cart.forEach(item => {
            cartHtml += `
                <div class="purchase-card" style="background: var(--accent-color); padding: 20px; border-radius: 8px; border: 1px solid #444;">
                    <h4 style="color: var(--primary-color); margin-bottom: 5px;">${item.course}</h4>
                    <p style="margin-bottom: 10px;">Price: ₹ ${item.price}</p>
                    <button class="btn" onclick="buyFromCart('${item.course}', ${item.price})" style="padding: 5px 15px; font-size: 0.9rem;">Buy Now</button>
                    <button class="btn" onclick="removeCartItem('${item.course}')" style="padding: 5px 15px; font-size: 0.9rem; background: transparent; border: 1px solid #666; margin-left: 10px;">Remove</button>
                </div>
            `;
        });
        cartHtml += '</div>';
        cartList.innerHTML = cartHtml;
    }

    // Load Purchases
    const coursesList = document.getElementById('courses-list');
    const purchases = JSON.parse(localStorage.getItem('purchases_' + userEmail) || '[]');

    if (purchases.length === 0) {
        coursesList.innerHTML = '<p>No courses purchased yet.</p>';
    } else {
        let html = '<div class="purchase-grid" style="display: grid; gap: 20px;">';
        purchases.forEach(p => {
            html += `
                <div class="purchase-card" style="background: var(--accent-color); padding: 20px; border-radius: 8px; border: 1px solid #444;">
                    <h4 style="color: var(--primary-color); margin-bottom: 5px;">${p.course}</h4>
                    <p style="margin-bottom: 0;">Price: ₹ ${p.price}</p>
                    <p style="font-size: 0.8rem; color: #888;">Purchased: ${p.date}</p>
                </div>
            `;
        });
        html += '</div>';
        coursesList.innerHTML = html;
    }
}

// Buy from Cart - Redirects to Registration for payment
function buyFromCart(courseName, price) {
    localStorage.setItem('selectedCourseName', courseName);
    localStorage.setItem('selectedCoursePrice', price);
    window.location.href = 'register.html';
}

// Remove single item from UI
function removeCartItem(courseName) {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        removeFromCart(userEmail, courseName);
        loadProfile(); // Re-render
    }
}

// Handle Feedback Form Submission (Auto-Download Logic)
function handleFeedback(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;



    if (name && email && message) {
        const feedbackData = {
            name: name,
            email: email,
            message: message
        };

        fetch('/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                alert('Feedback saved successfully to the Database!');
                document.getElementById('feedback-form').reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to save feedback. Please make sure the server is running (python3 server.py).');
            });
    }
}

// Toggle Happy New Year Message
// Toggle Happy New Year Message
// Toggle Happy New Year Message
function toggleNewYearMessage() {
    const msg = document.getElementById('hny-message');
    const btn = document.getElementById('hny-btn');

    // Dynamically set content to ensure it shows even if HTML is cached
    msg.innerHTML = `HAPPY NEW YEAR 2026!<br>
    <span style="font-size: 1.5rem; display: block; margin-top: 10px; color: #fff;">
        Use Coupon Code <strong style="color: #ffcc00; border: 1px dashed #ffcc00; padding: 5px;">NEWYEAR26</strong> for 30% OFF!
    </span>`;

    if (msg.style.display === 'none') {
        msg.style.display = 'block';
        btn.innerText = 'Hide New Year Message';
    } else {
        msg.style.display = 'none';
        btn.innerText = 'Show New Year Message';
    }
}

// Check for File Protocol and Suggest Server Mode
(function () {
    if (window.location.protocol === 'file:') {
        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.background = '#ffcc00';
        banner.style.color = '#000';
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        banner.style.zIndex = '10000';
        banner.style.fontWeight = 'bold';
        banner.style.fontFamily = 'Arial, sans-serif';
        banner.innerHTML = `
            ⚠️ functionality Limited: You are viewing this file directly. 
            <a href="http://localhost:8000${window.location.pathname.split('/').pop()}" style="color: #000; text-decoration: underline; margin-left: 10px;">
                Click here to enable Feedback Saving
            </a>
        `;
        document.body.appendChild(banner);
        document.body.style.marginTop = '40px';
    }
})();
