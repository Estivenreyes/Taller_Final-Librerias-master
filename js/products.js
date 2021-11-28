import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

products.forEach(async (product) => {
    await setDoc(doc(db, "products", `01AK8U2430YOSL3${product.id}`), product);
});