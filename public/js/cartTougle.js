document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.getElementById("cart-icon2");
  const shoppingBag = document.querySelector(".shopping-bag");
  const closeBtn = document.getElementById("close-cart");

  if (cartIcon && shoppingBag) {
    cartIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      shoppingBag.classList.toggle("show");
    });

    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      shoppingBag.classList.remove("show");
    });

    // Optional: clicking outside closes it
    document.addEventListener("click", (e) => {
      if (
        shoppingBag.classList.contains("show") &&
        !shoppingBag.contains(e.target) &&
        !cartIcon.contains(e.target)
      ) {
        shoppingBag.classList.remove("show");
      }
    });
  }
});
