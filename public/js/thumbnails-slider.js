const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const thumbnailsSlider = document.querySelector(".thumbnails-slider");
const thumbnailsImg = document.querySelectorAll(".thumbnail");
const thumbnailWidth = thumbnailsImg[0].offsetWidth + 12;
let slideIndex = 0;

function showSlide(index) {
    if(index > thumbnailsImg.length - 5){
        slideIndex = 0;
    }
    else if(index < 0){
        slideIndex = thumbnailsImg.length - 5;
    }
    else{
        slideIndex = index;
    }
    thumbnailsSlider.style.transform = `translateX(-${slideIndex * thumbnailWidth}px)`;
}

next.addEventListener("click", () => { showSlide(slideIndex + 1)});
prev.addEventListener("click", () => { showSlide(slideIndex - 1)});