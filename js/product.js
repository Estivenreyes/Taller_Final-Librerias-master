import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getProduct = async () => {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    const productId = searchParams.get("id");

    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    productSection.classList.add("loaded");
    spinner.classList.add("loaded");

    loadProductInfo(data);
}

const productSection = document.getElementById("product");
const spinner = document.getElementById("spinner");
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productInfo = document.getElementById("productInfo");
const productPrice = document.getElementById("productPrice");
const productGallery = document.getElementById("gallery");

const createGallery = (images) => {
    const gallery = document.createElement("div");

    images.forEach(image => {
        const currentImage = document.createElement("img");
        currentImage.setAttribute("src", image);
        currentImage.addEventListener("click", e => {
            productImage.setAttribute("src", image);
        });
        gallery.appendChild(currentImage);
    });
    productGallery.appendChild(gallery);
}

const loadProductInfo = (product) => {
    productName.innerText = product.name;
    productInfo.innerText = product.info;
    productPrice.innerHTML = `<h3 class="product__price">${formatCurrency(product.price)} COP</h3>`;
    productImage.setAttribute("src", product.images[0]);
    if (product.images) {
        createGallery(product.images)
    }
};

getProduct();