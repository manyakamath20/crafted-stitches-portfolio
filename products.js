
// ==================== CART LOGIC ====================
let cart = []; // default empty cart
const savedCart = localStorage.getItem("cartData");
if (savedCart) cart = JSON.parse(savedCart);

updateCart();

// Add item to cart
function addToCart(name, price, qty) {
  cart.push({ name, price, qty });
  updateCart();
  localStorage.setItem("cartData", JSON.stringify(cart));
}

// Update cart UI
function updateCart() {
  const cartContainer = document.getElementById("cartItems");
  const totalEl = document.getElementById("totalPrice");
  if (!cartContainer || !totalEl) return;

  cartContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<span>${item.name} (x${item.qty})</span><span>₹${item.price * item.qty}</span>`;
    cartContainer.appendChild(div);
    total += item.price * item.qty;
  });

  totalEl.innerText = "Total: ₹" + total;
}

// ==================== CART BUY NOW ====================
const cartBuyNow = document.getElementById("cartBuyNow");
if (cartBuyNow) {
  cartBuyNow.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add an item first.");
      return;
    }
    alert("Thank you! Your order is confirmed.");
    cart = [];
    updateCart();
    localStorage.removeItem("cartData");

    // Open Feedback Modal after Buy Now
    fbModal.style.display = "flex";
  });
}

// ==================== PRODUCT MODAL ====================
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalQty = document.getElementById("modalQty");
const modalAddCart = document.getElementById("modalAddCart");
const modalBuyNow = document.getElementById("modalBuyNow");
const modalClose = document.getElementById("modalClose");

let currentProduct = null;

if (modal && modalTitle && modalPrice && modalQty && modalAddCart && modalBuyNow && modalClose) {
  document.querySelectorAll(".product").forEach(card => {
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    if (!name || !price) return;

    card.addEventListener("click", () => {
      currentProduct = { name, price };
      modalTitle.textContent = name;
      modalPrice.textContent = "Price: ₹" + price;
      modalQty.value = 1;
      modal.style.display = "flex";
    });
  });

  modalAddCart.addEventListener("click", () => {
    if (!currentProduct) return;
    const qty = Number(modalQty.value) || 1;
    addToCart(currentProduct.name, currentProduct.price, qty);
    modal.style.display = "none";
  });

  modalBuyNow.addEventListener("click", () => {
    if (!currentProduct) return;
    const qty = Number(modalQty.value) || 1;
    addToCart(currentProduct.name, currentProduct.price, qty);
    modal.style.display = "none";
    alert("Thank you! Your order is confirmed.");
    cart = [];
    updateCart();
    localStorage.removeItem("cartData");

    // Open Feedback Modal after order confirmation
    fbModal.style.display = "flex";
  });

  modalClose.addEventListener("click", () => { modal.style.display = "none"; });
  modal.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });
}

// ==================== FEEDBACK MODAL ====================

// Create modal dynamically and append to body
const fbModalHTML = `
<div id="fbModal" class="modal-overlay" style="display:none; z-index:2000;">
  <div class="modal">
    <h3>Submit Your Feedback</h3>
    <label>Name:</label>
    <input type="text" id="fbName" placeholder="Enter your name" style="width:100%; padding:8px; border-radius:8px; margin-bottom:10px;"/>
    <label>Rating:</label>
    <div id="fbStars" style="display:flex; gap:4px; margin-bottom:10px;">
      <span class="star" data-value="1">&#9734;</span>
      <span class="star" data-value="2">&#9734;</span>
      <span class="star" data-value="3">&#9734;</span>
      <span class="star" data-value="4">&#9734;</span>
      <span class="star" data-value="5">&#9734;</span>
    </div>
    <label>Feedback:</label>
    <textarea id="fbMessage" rows="4" placeholder="Write your feedback here" style="width:100%; padding:8px; border-radius:8px;"></textarea>
    <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
      <button class="btn btn-primary" id="fbSubmit">Submit</button>
      <button class="btn btn-ghost" id="fbClose">Close</button>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", fbModalHTML);

const fbModal = document.getElementById("fbModal");
const fbSubmit = document.getElementById("fbSubmit");
const fbClose = document.getElementById("fbClose");
const fbStarsContainer = document.getElementById("fbStars");
let fbRating = 0;

// Star selection
function updateStars(rating) {
  fbRating = rating;
  fbStarsContainer.querySelectorAll(".star").forEach(star => {
    star.innerHTML = Number(star.dataset.value) <= rating ? "&#9733;" : "&#9734;";
  });
}

fbStarsContainer.querySelectorAll(".star").forEach(star => {
  star.addEventListener("click", () => updateStars(Number(star.dataset.value)));
});

// Close feedback modal
fbClose.addEventListener("click", () => { fbModal.style.display = "none"; });

// ==================== FEEDBACK SUBMISSION ====================

// Apps Script Web App URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwTGzMmeQ6JEZXdIhe6rPfBWQkfk36ZP2yj0jo-55VmJVxIv5otCrm80bPhfSt8uCAE/exec";

fbSubmit.addEventListener("click", () => {
  const name = document.getElementById("fbName").value.trim();
  const message = document.getElementById("fbMessage").value.trim();

  if (!name || !message || fbRating === 0) {
    alert("Please enter name, rating, and feedback.");
    return;
  }

  const data = {
    name: name,
    stars: fbRating,
    message: message
  };

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",   // ⭐ THIS FIXES IT
    body: JSON.stringify(data)
  });

  // Since response cannot be read in no-cors mode
  alert("Thank you for your feedback!");
  fbModal.style.display = "none";

  // Reset form
  fbRating = 0;
  updateStars(0);
  document.getElementById("fbName").value = "";
  document.getElementById("fbMessage").value = "";
});

