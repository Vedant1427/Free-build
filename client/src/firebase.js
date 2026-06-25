// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "freebuild-8ce13.firebaseapp.com",
    projectId: "freebuild-8ce13",
    storageBucket: "freebuild-8ce13.firebasestorage.app",
    messagingSenderId: "942701114616",
    appId: "1:942701114616:web:c3c7eb57de19d69cec770d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }