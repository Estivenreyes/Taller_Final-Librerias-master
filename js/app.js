import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let products = [];
let cart = [];
let userLogged = null;

const Ahidden = document.getElementById("Ahidden");

const getAllProducts = async () => {
    const collectionRef = collection(db, "products");
    const { docs } = await getDocs(collectionRef);

    const firebaseProducts = docs.map((doc) => {
        return {
            ...doc.data(),
            id: doc.id,
        }
    })

    firebaseProducts.forEach(product => {
        productTemplate(product);
    });

    products = firebaseProducts;
}


const getFirebaseCart = async (userId) => {
    const docRef = doc(db, "cart", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {
        products: []
    }
};

const addProductsToCart = async (products) => {
    await setDoc(doc(db, "cart", userLogged.uid), {
        products
    });
};

const getMyCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

const productsSection = document.getElementById("products");

const productTemplate = (item) => {
    const product = document.createElement("a");

    product.className = "product";

    product.setAttribute("href", `./product.html?id=${item.id}`);
    const isAdded = cart.some(product => product.id === item.id);
    let buttonHtml;

    if (isAdded) {
        buttonHtml = `<button class="product__cart" disabled>Añadido</button>`;
    } else {
        buttonHtml = `<button class="product__cart">Agregar al carrito</button>`;
    }

    product.innerHTML = `
    <img src="${item.images[0]}" alt="" class="product__img">
    <div class="product__description">
        <h3 class="product__price">${formatCurrency(item.price)} COP</h3>
        <p class="product__tag">${item.description}</p>
        <h4>MÁS INFORMACIÓN</h4>

        ${buttonHtml}
    </div>
    `;
    productsSection.appendChild(product);

    const productCartButton = product.querySelector(".product__cart");

    productCartButton.addEventListener("click", e => {
        e.preventDefault();
        productCartButton.innerHTML = `<button class="product__cart" disabled>Añadido</button>`;
        const productAdded = {
            id: item.id,
            name: item.name,
            image: item.images[0],
            price: item.price
        };
        cart.push(productAdded);
        if (userLogged) {
            addProductsToCart(cart);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        productCartButton.setAttribute("disabled", true);
    });
}

const filterByCategory = document.getElementById("categories");

const orderBySelect = document.getElementById("orderBy");

orderBySelect.addEventListener("change", e => {
    loadProducts();
})

filterByCategory.addEventListener("change", e => {

    loadProducts();

});

const loadProducts = () => {
    const category = filterByCategory.value;
    const order = orderBySelect.value;
    productsSection.innerHTML = "";

    let filteredProductsByCategory;

    if (category !== "") {
        filteredProductsByCategory = products.filter((product) =>
            product.type === category);
    } else {
        filteredProductsByCategory = products;
    }

    if (order === "asc") {
        filteredProductsByCategory = filteredProductsByCategory.sort((a, b) =>
            a.price - b.price);
    }
    if (order === "desc") {
        filteredProductsByCategory = filteredProductsByCategory.sort((a, b) =>
            b.price - a.price);
    }

    filteredProductsByCategory.forEach(product => {
        productTemplate(product);
    });
}

const getUserInfo = async (userId) => {

    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (e) {
        console.log(e);
    }
}

onAuthStateChanged(auth, async (user) => {

    if (user) {
        const userInfo = await getUserInfo(user.uid);
        if (userInfo.isAdmin == true) {
            Ahidden.classList.add("visible");
        } else {
            Ahidden.classList.remove("visible");
        };
        let result = await getFirebaseCart(user.uid);
        cart = result.products;
        userLogged = user;
    } else {
        cart = getMyCart();
        Ahidden.classList.remove("visible");
    }
    getAllProducts();
});

