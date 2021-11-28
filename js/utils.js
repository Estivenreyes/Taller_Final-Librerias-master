const firebaseConfig = {
  apiKey: "AIzaSyAkX7mqPZb0ChCKUzSmAWXWBPKQiNM50JY",
  authDomain: "bufandafirebase.firebaseapp.com",
  projectId: "bufandafirebase",
  storageBucket: "bufandafirebase.appspot.com",
  messagingSenderId: "613420783855",
  appId: "1:613420783855:web:8f3318998c630ff1b2a31a",
  measurementId: "G-2DSWXGDEHM"
};

const formatCurrency = (price) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
};