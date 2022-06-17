// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { 
	GoogleAuthProvider,
	getAuth,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
	deleteUser,
	linkWithRedirect,
	getRedirectResult,
	updateProfile
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
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
		console.log(uid)
    // ...
  } else {
    // User is signed out
    // ...
  }
});

export const registerUserWithEmailAndPassword = async (username, email, password) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		await updateProfile(userCredential.user, {
			displayName: username
		});
		return {successMessages: ['Welcome aboard!']}
	} catch (err) {
		console.log(err)
	}
}


export const passwordReset = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		alert('Password reset email has been sent');
	} catch (err) {
		console.log(err)
	}
};

export const deleteAccount = async (user) => {
	try {
		await deleteUser(user);
		console.log('Account deleted');
	} catch (err) {
		console.log(err);
	}
}

export const logout = () => {
	signOut(auth);
};

export const authLink = async () => {
	try {
		await linkWithRedirect(auth.currentUser, googleProvider);
	} catch (err) {
		console.log(err)
	}
}
