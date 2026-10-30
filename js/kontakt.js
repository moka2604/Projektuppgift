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

const cartCount = document.querySelector(".cart-count");
if (cartCount) {
  const cart = JSON.parse(localStorage.getItem("racebutiken-cart") || "[]");
  cartCount.textContent = String(
    cart.reduce((sum, item) => sum + item.quantity, 0)
  );
}
