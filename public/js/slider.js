const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const slideWidth = slides[0].offsetWidth + 15;
let slideIndex = 0; //243px

function showSlide(index) {
    if(index > slides.length - 4){
        slideIndex = 0;
    }
    else if(index < 0){
        slideIndex = slides.length - 4;
    }
    else{
        slideIndex = index;
    }
    slider.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
}
next.addEventListener("click", () => { showSlide(slideIndex + 1)});
prev.addEventListener("click", () => { showSlide(slideIndex - 1)});


