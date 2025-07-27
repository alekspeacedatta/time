document.querySelectorAll(".brand").forEach(brandSection => {
    const next = brandSection.querySelector(".next");
    const prev = brandSection.querySelector(".prev");
    const slider = brandSection.querySelector(".slider");
    const slides = brandSection.querySelectorAll(".slide");
    const slideWidth = slides[0].offsetWidth + 15;
    let slideIndex = 0; 

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
        slider.style.transform = `translateX(-${slideIndex * 23}vw)`;
    }
    next.addEventListener("click", () => { showSlide(slideIndex + 1)});
    prev.addEventListener("click", () => { showSlide(slideIndex - 1)});
})
