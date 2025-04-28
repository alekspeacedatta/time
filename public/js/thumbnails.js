const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('mainImage');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener("click", function(){
        mainImage.src = this.src;
    });
});