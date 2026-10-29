const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Öppna meny" : "Stäng meny");
    mainNav.classList.toggle("is-open", !isOpen);
  });
}

const productCards = [...document.querySelectorAll(".product-card")];
const cartCount = document.querySelector(".cart-count");
const cartItemsList = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartTotal = document.querySelector(".cart-total");
const cartNote = document.querySelector(".cart-note");

const cartStorageKey = "racebutiken-cart";
const legacyProductIds = { dot4: "dot4-134", dot51: "dot51-149" };

let cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]").map((item) => ({
  ...item,
  id: legacyProductIds[item.id] || item.id,
}));

const saveCart = () => {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
};

const renderCart = () => {
  cartItemsList.replaceChildren();
  
  let total = 0;
  let hasUnknownPrice = false;
  
  const productById = new Map(
    productCards.map((card) => [card.dataset.id, card])
  );

  cart = cart.filter((item) => productById.has(item.id) && item.quantity > 0);

  cart.forEach((item) => {
    const product = productById.get(item.id);
    const price = product.dataset.price ? Number(product.dataset.price) : null;

    const row = document.createElement("li");
    const details = document.createElement("span");
    const removeButton = document.createElement("button");

    details.textContent = `${product.querySelector("h2").textContent} × ${item.quantity} — ${
      price === null ? "Pris saknas" : `${price * item.quantity} kr`
    }`;

    removeButton.type = "button";
    removeButton.textContent = "Ta bort";
    removeButton.dataset.removeId = item.id;
    
    row.append(details, removeButton);
    cartItemsList.append(row);

    if (price === null) {
      hasUnknownPrice = true;
    } else {
      total += price * item.quantity;
    }
  });

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  cartCount.textContent = String(count);
  cartEmpty.hidden = count > 0;
  cartTotal.hidden = count === 0;
  cartNote.hidden = !hasUnknownPrice;
  cartTotal.textContent = `Totalsumma: ${total} kr`;
};

productCards.forEach((card) => {
  card.querySelector(".add-to-cart").addEventListener("click", () => {
    const existing = cart.find((item) => item.id === card.dataset.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: card.dataset.id, quantity: 1 });
    }

    saveCart();
    renderCart();
  });
});

cartItemsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-id]");
  if (!button) return;

  cart = cart.filter((item) => item.id !== button.dataset.removeId);
  saveCart();
  renderCart();
});

window.addEventListener("storage", (event) => {
  if (event.key !== cartStorageKey) return;
  
  cart = JSON.parse(event.newValue || "[]");
  renderCart();
});

if (window.location.hash === "#varukorg") {
  document.querySelector(".cart").open = true;
}

renderCart();
