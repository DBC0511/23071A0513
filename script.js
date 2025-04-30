document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartDisplay();

    // Register Form Submission
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("regUsername").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value.trim();

        if (!username || !email || !password) {
            alert("Please fill in all registration fields.");
            return;
        }
        if (!validateEmail(email)) {
            alert("Invalid email format.");
            return;
        }

        // Save user data to localStorage
        const user = { username, email, password };
        localStorage.setItem("user", JSON.stringify(user));
        alert("Registration successful!");
        registerForm.reset();
    });

    // Login Form Submission
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        if (!email || !password) {
            alert("Please fill in both login fields.");
            return;
        }
        if (!validateEmail(email)) {
            alert("Invalid email format.");
            return;
        }

        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser && savedUser.email === email && savedUser.password === password) {
            alert(`Welcome back, ${savedUser.username}!`);
        } else {
            alert("Invalid email or password.");
        }
        loginForm.reset();
    });

    // Add items to cart
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productElement = e.target.closest(".product");
            const productId = productElement.getAttribute("data-id");
            const productName = productElement.querySelector("h3").textContent;
            const productPrice = parseFloat(productElement.querySelector("p").textContent.replace('$', ''));

            // Check if the product is already in the cart
            const existingProductIndex = cart.findIndex((item) => item.id === productId);

            if (existingProductIndex === -1) {
                // Product is not in the cart, add it
                cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
            } else {
                // Product exists, increase quantity
                cart[existingProductIndex].quantity += 1;
            }

            // Save updated cart to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Update the cart display
            updateCartDisplay();
        });
    });

    // Update cart display (This will be used in cart.html)
    function updateCartDisplay() {
        const cartCount = document.getElementById("cartCount");
        if (cartCount) {
            cartCount.textContent = cart.length; // Update the cart item count
        }
    }

    // Email Validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
