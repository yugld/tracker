// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-lJ5a8gUPsrlDU5uissUvJvx_J5GK7rU",
  authDomain: "tracker-app-1a3e5.firebaseapp.com",
  projectId: "tracker-app-1a3e5",
  storageBucket: "tracker-app-1a3e5.firebasestorage.app",
  messagingSenderId: "1036348955004",
  appId: "1:1036348955004:web:3c921b995c4b9aee87ecf9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
