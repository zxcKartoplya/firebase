import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"; // Импортируйте getFirestore  

const firebaseConfig = {  
    apiKey: "AIzaSyAKX26iSHmdxNa9MkhahpQpTfmkQoX_wn8",  
    authDomain: "vue3-f3307.firebaseapp.com",  
    projectId: "vue3-f3307",  
    storageBucket: "vue3-f3307.firebasestorage.app",  
    messagingSenderId: "1055104187846",  
    appId: "1:1055104187846:web:5ff4cb0f307382881206c7",  
    measurementId: "G-W9H9P9PE5Y"  
};  

// Инициализация Firebase  
const app = initializeApp(firebaseConfig);  
const analytics = getAnalytics(app);  

// Инициализация Firestore  
const db = getFirestore(app);  
export { db }
