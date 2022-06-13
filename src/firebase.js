// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { 
	GoogleAuthProvider,
	getAuth,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut
} from "firebase/auth";

const config = {
  apiKey: "AIzaSyBXdXg6cS2diYHfF4qaLJmkpR3lgDybkmE",
  authDomain: "healthhelper-floyddroid.firebaseapp.com",
  projectId: "healthhelper-floyddroid",
  storageBucket: "healthhelper-floyddroid.appspot.com",
  messagingSenderId: "389436309778",
  appId: "1:389436309778:web:9d320831d67fcfe40db3cb",
  measurementId: "G-C77RW9LFJJ"
};

// Initialize Firebase
const app = initializeApp(config);
const auth = getAuth(app);

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });
