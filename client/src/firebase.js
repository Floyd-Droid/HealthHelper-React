import { initializeApp } from "firebase/app";
import { 
	EmailAuthProvider,
	GoogleAuthProvider,
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
	deleteUser,
	signInWithRedirect,
	linkWithRedirect,
	linkWithCredential,
	updateProfile,
	updateEmail
} from "firebase/auth";

import { validate } from 'react-email-validator';
import { validateSubmittedUsername, validateSubmittedPassword } from "./services/Validation";

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
export const emailProvider = new EmailAuthProvider();
export const googleProvider = new GoogleAuthProvider();

export const welcomeMessage = `Welcome aboard! This is the Index, where food entries are stored. 
	We'll start you off with some basic foods, but feel free to edit or remove them. After you're done, 
	you can head over to the Log section and use them as the basis to build a daily log of foods to 
	track total nutrition and cost.
`;

export const errorWelcomeMessage = `Welcome aboard! This is the Index, where food entries are stored. 
	After creating a few entries, you can head over to the Log section and use them as the basis 
	to build a daily log of foods to track total nutrition and cost.
`;

const validateEmail = (email) => {
	return validate(email);
}

export const extractFirebaseErrorMessage = (err) => {
	if (err.name === 'FirebaseError') {
		return err.code.split('/')[1].replaceAll('-',' ');
	}	else {
		return err;
	}
}

export const registerUserWithEmailAndPassword = async (username, email, password) => {
	if (!validateEmail(email)) {
		return {errorMessage: 'Invalid email'};
	}

	const validateUsernameResult = validateSubmittedUsername(username);
	if (typeof validateUsernameResult.errorMessage !== 'undefined') {
		return validateUsernameResult;
	}

	const validatePasswordResult = validateSubmittedPassword(password);
	if (typeof validatePasswordResult.errorMessage !== 'undefined') {
		return validatePasswordResult;
	}

	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		await updateProfile(userCredential.user, {
			displayName: username.trim()
		});

		return {user: userCredential.user};
	} catch (err) {
		return {errorMessage: `Login failed: ${extractFirebaseErrorMessage(err)}.`};
	}
}

export const logInWithEmailAndPassword = async (email, password) => {
	if (!validateEmail(email)) {
		return ({errorMessage: 'Invalid email'});
	}

	try {
		const res = await signInWithEmailAndPassword(auth, email, password);
		return res;
	} catch (err) {
		return {errorMessage: `Your email or password was incorrect. Please try again.`};
	}
}

export const logInWithGoogle = async () => {
	try {
		const res = await signInWithRedirect(auth, googleProvider);
		return res;
	} catch (err) {
		return {errorMessage: `Login failed: ${extractFirebaseErrorMessage(err)}.`};
	}
}

export const passwordReset = async (email) => {
	if (!validateEmail(email)) {
		return {errorMessage: 'Invalid email'};
	}
	
	try {
		await sendPasswordResetEmail(auth, email);
		return {successMessage: `Password reset email has been sent to ${email}.`};
	} catch (err) {
		return {errorMessage: `Password reset failed: ${extractFirebaseErrorMessage(err)}.`};
	}
};

export const deleteAccount = async () => {
	try {
		await deleteUser(auth.currentUser);
		return {successMessage: 'Your account has been deleted.'};
	} catch (err) {
		return {errorMessage: `Could not delete account: ${extractFirebaseErrorMessage(err)}`};
	}
}

export const logout = () => {
	signOut(auth);
};

export const authProviderLink = async () => {
	try {
		const res = await linkWithRedirect(auth.currentUser, googleProvider);
		return res;
	} catch (err) {
		return {errorMessage: `Could not link accounts: ${extractFirebaseErrorMessage(err)}`};
	}
}

export const authEmailLink = async (linkEmail, linkPassword) => {
	if (!validateEmail(linkEmail)) {
		return ({errorMessage: 'Invalid email'});
	}

	try {
		const credential = EmailAuthProvider.credential(linkEmail, linkPassword);
		await linkWithCredential(auth.currentUser, credential);
		return {successMessage: 'Accounts have been successfully linked'};
	} catch (err) {
		return {errorMessage: `Could not link accounts: ${extractFirebaseErrorMessage(err)}`};
	}
}

export const updateUsername = async (currentUsername, newUsername) => {
	try {
		const validateUsernameResult = validateSubmittedUsername(newUsername);
		if (typeof validateUsernameResult.errorMessage !== 'undefined') {
			return validateUsernameResult;
		} 

		await updateProfile(auth.currentUser, {displayName: newUsername.trim()});
		return {successMessage: 'Username updated'};
	} catch(err) {
		return {errorMessage: `Could not update username: ${extractFirebaseErrorMessage(err)}`};
	}
}

export const updateUserEmail = async (currentEmail, newEmail) => {
	if (!validateEmail(newEmail)) {
		return ({errorMessage: 'Invalid email'});
	}

	try {
		if (newEmail !== currentEmail) {
			await updateEmail(auth.currentUser, newEmail);
			return {successMessage: 'Email successfully updated'};
		} else {
			return {errorMessage: 'Email not updated. Please provide a different email'}
		}
	} catch (err) {
		return {errorMessage: `Could not update email: ${extractFirebaseErrorMessage(err)}`};
	}
}
