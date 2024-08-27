// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCVnwiaN80BsdIHza1utFgeVcDF5yISnWA",
    authDomain: "codecopyprac.firebaseapp.com",
    projectId: "codecopyprac",
    storageBucket: "codecopyprac.appspot.com",
    messagingSenderId: "108112113101",
    appId: "1:108112113101:web:afd0029f70a6c400822884",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
