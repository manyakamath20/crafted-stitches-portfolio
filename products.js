// shared cart
let cart = [];                       // default: empty cart

const savedCart = localStorage.getItem("cartData");
if (savedCart) {                     // if something was saved earlier
  cart = JSON.parse(savedCart);     // turn the string back into an array
}

updateCart();   

// add item to cart
function addToCart(name, price, qty){
  cart.push({ name, price, qty });
  updateCart();
  localStorage.setItem("cartData", JSON.stringify(cart));
}

// render cart UI (called on all pages, but only works where cart exists)
function updateCart() {
  const cartContainer = document.getElementById("cartItems");
  const totalEl = document.getElementById("totalPrice");

  if (!cartContainer || !totalEl) return; // page without cart

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} (x${item.qty})</span>
      <span>₹${item.price * item.qty}</span>
    `;
    cartContainer.appendChild(div);
    total += item.price * item.qty;
  });

  totalEl.innerText = "Total: ₹" + total;
}

// cart Buy Now button (if present)
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
  });
}

// modal elements (shared structure)
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalQty = document.getElementById("modalQty");
const modalAddCart = document.getElementById("modalAddCart");
const modalBuyNow = document.getElementById("modalBuyNow");
const modalClose = document.getElementById("modalClose");

let currentProduct = null;

// only wire up modal if the elements exist on this page
if (
  modal && modalTitle && modalPrice && modalQty &&
  modalAddCart && modalBuyNow && modalClose
) {
  // any .product with data-name & data-price will work
  document.querySelectorAll(".product").forEach(card => {
    const name = card.dataset.name;
    const price = card.dataset.price;
    if (!name || !price) return;

    card.addEventListener("click", () => {
      const p = Number(card.dataset.price);
      currentProduct = { name, price: p };

      modalTitle.textContent = name;
      modalPrice.textContent = "Price: ₹" + p;
      modalQty.value = 1;
      modal.style.display = "flex";
    });
  });

  // add to cart from modal
  modalAddCart.addEventListener("click", () => {
    if (!currentProduct) return;
    const qty = Number(modalQty.value) || 1;
    addToCart(currentProduct.name, currentProduct.price, qty);
    modal.style.display = "none";
  });

  // buy now directly from modal
  modalBuyNow.addEventListener("click", () => {
    if (!currentProduct) return;
    const qty = Number(modalQty.value) || 1;
    addToCart(currentProduct.name, currentProduct.price, qty);
    alert("Thank you! Your order is confirmed. (Demo)");
    modal.style.display = "none";
  });

  // close actions
  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}
