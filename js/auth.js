let password;

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkX7mqPZb0ChCKUzSmAWXWBPKQiNM50JY",
  authDomain: "bufandafirebase.firebaseapp.com",
  projectId: "bufandafirebase",
  storageBucket: "bufandafirebase.appspot.com",
  messagingSenderId: "613420783855",
  appId: "1:613420783855:web:8f3318998c630ff1b2a31a",
  measurementId: "G-2DSWXGDEHM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");
const logoutButton = document.getElementById("logout");

const createUser = async (email, password, userFields) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const userId = user.uid;
    const userInfo = await getUserInfo(user.uid);

    await setDoc(doc(db, "users", userId), userFields);

    window.location.href = "./products.html";
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      alert("Este email ya está en uso");
    }
    if (e.code === "auth/weak-password") {
      alert("La contraseña está muy debil");
    }
    console.log(e)
  }
}
const getUserInfo = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (e) {
    console.log(e)
  }
}

const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userInfo = await getUserInfo(user.uid);
  } catch (e) {
    console.log(e)
  }
}

const logout = async () => {
  try {
    await signOut(auth);
    const { user } = null;
  } catch (e) {
    console.log(e)
  }
}

if (registerForm) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = registerForm.name.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const passwordConfirmation = registerForm.passwordConfirmation.value;
    const address = registerForm.address.value
    const city = registerForm.city.value

    if (password === passwordConfirmation) {

      if (email && password) {
        createUser(email, password, {
          name,
          address,
          city,
          email,
          password,
          isAdmin: false,
        });
      } else {
        alert("Completa todos los campos");
      }

    } else {
      alert("Las contraseñas no coinciden");
    }

  });
}
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    if (email && password) {
      login(email, password);
    } else {
      alert("Completa todos los campos");
    }
  });

}

logoutButton.addEventListener("click", e => {
  logout();
})

onAuthStateChanged(auth, (user) => {
  if (user) {
    logoutButton.classList.add("visible");
  } else {
    logoutButton.classList.remove("visible");
  }
});