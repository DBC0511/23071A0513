document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
  
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartDisplay();
  
    // Register
    if (registerForm) {
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
  
        const user = { username, email, password };
        localStorage.setItem("user", JSON.stringify(user));
        alert("Registration successful!");
        registerForm.reset();
      });
    }
  
    // Login
    if (loginForm) {
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
    }
  
    // Add to Cart
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const productElement = e.target.closest(".product");
        const productId = productElement.getAttribute("data-id");
        const productName = productElement.querySelector("h3").textContent;
        const productPrice = parseFloat(productElement.querySelector("p").textContent.replace('$', ''));
  
        const existingProductIndex = cart.findIndex((item) => item.id === productId);
        if (existingProductIndex === -1) {
          cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        } else {
          cart[existingProductIndex].quantity += 1;
        }
  
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
      });
    });
  
    // Update Cart Display
    function updateCartDisplay() {
      const cartCount = document.getElementById("cartCount");
      const cartItemsContainer = document.getElementById("cartItems");
      const cartTotal = document.getElementById("cartTotal");
  
      if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
      }
  
      if (cartItemsContainer && cartTotal) {
        cartItemsContainer.innerHTML = "";
        if (cart.length === 0) {
          cartItemsContainer.innerHTML = "<li class='list-group-item'>Your cart is empty.</li>";
          cartTotal.innerHTML = "<strong>Total: $0</strong>";
          return;
        }
  
        let total = 0;
        cart.forEach(item => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between align-items-center";
  
          const itemText = document.createElement("span");
          itemText.textContent = `${item.name} (x${item.quantity})`;
  
          const priceText = document.createElement("span");
          priceText.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
          priceText.classList.add("ms-2");
  
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "Remove";
          removeBtn.className = "btn btn-danger btn-sm ms-2";
          removeBtn.setAttribute("data-id", item.id);
          removeBtn.addEventListener("click", removeFromCart);
  
          const rightSide = document.createElement("div");
          rightSide.className = "d-flex align-items-center";
          rightSide.appendChild(priceText);
          rightSide.appendChild(removeBtn);
  
          li.appendChild(itemText);
          li.appendChild(rightSide);
  
          cartItemsContainer.appendChild(li);
          total += item.price * item.quantity;
        });
  
        cartTotal.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
      }
    }
  
    // Remove from Cart Function
    function removeFromCart(e) {
      const productId = e.target.getAttribute("data-id");
      cart = cart.filter(item => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
    }
  
    // Email Validation
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  });
  
