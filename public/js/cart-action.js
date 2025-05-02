document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const id = button.dataset.id;


            const res = await fetch(`/add-to-cart/${id}`, {
                method: "POST",
                headers: {
                    "Accept": "Application/json"
                }
            });
            if (res.ok) {
                const data = await res.json();
                document.querySelector(".shopping-bag").innerHTML = data.html;
                document.querySelector(".shopping-bag").classList.add("show");
            }
        });
    });

    document.querySelectorAll(".add-to-wishlist-btn").forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const id = button.dataset.id;

            const res = await fetch(`/add-to-wishlist/${id}`, {
                method: "POST"
            });
            if(res.ok){
                updateWishlistUi();
            }
        })
    })
})
// async function updateCartUi(){
//     const res = await fetch('/cart/blocks');
//     const html = await res.text();
//     document.querySelector(".shopping-bag").innerHTML = html;
//     document.querySelector(".shopping-bag").classList.add("show");
// }
async function updateWishlistUi(){
    const res = await fetch('/wishlist/blocks');
    const html = await res.text();
    document.querySelector(".wishlist").innerHTML = html;
    document.querySelector(".wishlist").classList.add("show")

}