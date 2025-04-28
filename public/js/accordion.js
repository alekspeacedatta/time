
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const accordionItem = header.parentElement;
    const accordionContent = accordionItem.querySelector('.accordion-content');
    const icon = header.querySelectorAll('span')[1]; 

    document.querySelectorAll('.accordion-content').forEach(content => {
      if (content !== accordionContent) {
        content.style.maxHeight = null;
        content.style.paddingTop = "0";
        content.style.paddingBottom = "0";
        const otherIcon = content.previousElementSibling.querySelectorAll('span')[1];
        if (otherIcon) otherIcon.textContent = "+";
      }
    });

    if (accordionContent.style.maxHeight) {
      accordionContent.style.maxHeight = null;
      accordionContent.style.paddingTop = "0";
      accordionContent.style.paddingBottom = "0";
      icon.textContent = "+";
    } else {
      accordionContent.style.display = "block"; 
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      accordionContent.style.paddingBottom = "1rem";
      icon.textContent = "−";
    }
  });
});
