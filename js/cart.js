import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const cartSection = document.getElementById("cart");
const totalSection = document.getElementById("total");
const checkoutForm = document.getElementById("checkout");
const autocompleteFields = document.getElementById("autofill");

let cart = [];
let userLogged = {};
let total = 0;

const getMyCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

const removeProduct = async (productId) => {

    const cart = getMyCart();

    const newCart = cart.filter(product => product.id !== productId);

    try {
        if (newCart.length) {
            await setDoc(doc(db, "cart", userLogged.uid), {
                products: newCart
            });
        } else {

            await deleteDoc(doc(db, "cart", userLogged.uid));
        }
    } catch (error) {
        console.log(error);
    }


    localStorage.setItem("cart", JSON.stringify(newCart));
    console.log(productId);

    renderMyCart(newCart);

};

const getFirebaseCart = async (userId) => {
    const docRef = doc(db, "cart", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {
        products: []
    }
};

const getUserInfo = async (userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (e) {
        console.log(e)
    }
}

const renderProduct = (product) => {

    const newProduct = document.createElement("li");
    newProduct.className = "product product--cart";
    newProduct.innerHTML = `
        <img src="${product.image}" alt="" class="product__thumbnail">
        <div class="product__info">
            <h2 class="product__name">${product.name}</h2>
            <h3 class="product__price">${formatCurrency(product.price)} COP</h3>
        </div>
        <button class="product__cart product__cart--thumb">Remove</button>
    `;

    cartSection.appendChild(newProduct);

    newProduct.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            removeProduct(product.id);
        }
    });

};

const renderMyCart = (cart) => {
    cartSection.innerHTML = "";
    total = 0;

    cart.forEach(product => {
        total += parseInt(product.price);
        renderProduct(product);
    });

    totalSection.innerText = `Total: ${formatCurrency(total)}`;
};

const deleteCart = async () => {
    try {
        await deleteDoc(doc(db, "cart", userLogged.uid));
        renderMyCart([]);
    } catch (e) {
        console.log(e)
    }
};

const createOrder = async (userFields) => {
    try {
        const order = await addDoc(collection(db, "orders"), {
            ...userFields,
            products: cart,
            total,
            email: userLogged.email,
            status: "pending",
        });
        alert(`Muchas gracias, tu pedido con ID: ${order.id} ha quedado registrado.`);

        deleteCart();
    } catch (e) {
        console.log(e)
    }
};

autocompleteFields.addEventListener("click", e => {
    checkoutForm.name.value = userLogged.name;
    checkoutForm.city.value = userLogged.city;
    checkoutForm.address.value = userLogged.address;
});

checkoutForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = checkoutForm.name.value;
    const city = checkoutForm.city.value;
    const address = checkoutForm.address.value;

    const userFields = {
        name,
        city,
        address
    };

    if (cart.length) {
        if (name && city && address) {
            createOrder(userFields);
        } else {
            alert("Completa todos los campos");
        }
    } else {
        alert("Selecciona algunos productos")
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const result = await getFirebaseCart(user.uid);
        cart = result.products;
        renderMyCart(cart);

        const userInfo = await getUserInfo(user.uid);
        userLogged = {
            ...user,
            ...userInfo
        };
    } else {
        cart = getMyCart();
        renderMyCart(cart);
    }
});