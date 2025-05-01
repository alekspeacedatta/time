document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.getElementById("cart-icon2");
  const shoppingBag = document.querySelector(".shopping-bag");
  const closeBtn = document.getElementById("close-cart");
  const wishListCloseBtn = document.getElementById("wishlist-close-cart");

  
  const wishlistIcon = document.getElementById("wishlist-icon");
  const wishList = document.querySelector(".wishlist");

  if(wishlistIcon && wishList){
    wishlistIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      wishList.classList.toggle("show");
    })
    wishListCloseBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      wishList.classList.remove("show");
    });
    document.addEventListener("click", (e) => {
      if (
        wishList.classList.contains("show") &&
        !wishList.contains(e.target) &&
        !wishlistIcon.contains(e.target)
      ) {
        wishList.classList.remove("show");
      }
    });
  }

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
