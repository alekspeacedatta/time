const cartIcon = document.getElementById("cart-icon");
  const shoppingBag = document.querySelector(".shopping-bag");
  const closeCartBtn = document.getElementById("close-cart");

  cartIcon?.addEventListener("click", () => {
    shoppingBag.classList.add("show");
  });

  closeCartBtn?.addEventListener("click", () => {
    shoppingBag.classList.remove("show");
  });