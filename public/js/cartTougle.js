document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.querySelector(".fa-cart-shopping");
  const shoppingBag = document.querySelector(".shopping-bag");

  cartIcon?.addEventListener("click", (e) => {
    e.stopPropagation(); 
    shoppingBag?.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!shoppingBag?.contains(e.target) && !cartIcon?.contains(e.target)) {
      shoppingBag?.classList.remove("show");
    }
  });
});
