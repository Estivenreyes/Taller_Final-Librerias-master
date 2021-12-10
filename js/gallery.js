const images = document.querySelector(".gallery").querySelectorAll("span");
const modal = document.querySelector(".gallery__modal");
const modalImg = modal.querySelector(".gallery__modal__img");
const modalClose = document.querySelector(".gallery__modal__close");

images.forEach((image) => {
    image.onclick = () => {
        console.log(image);

        modalImg.src = image.querySelector("img").src;

        modal.classList.remove("close");
        modal.classList.add("open");
    };
});

modalClose.onclick = () => {
    modal.classList.remove("open");
    modal.classList.add("close");
};
