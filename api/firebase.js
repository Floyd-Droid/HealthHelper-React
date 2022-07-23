import admin from 'firebase-admin';
import 'dotenv/config';

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
	})
});

export async function verifyFirebaseIdToken(req) {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		try {
			const idToken = authHeader.split(' ')[1];
			const decodedToken = await admin.auth().verifyIdToken(idToken);
			return decodedToken;
		} catch (err) {
			return {errorMessage: 'You must log in before attempting to create or alter entries.'};
		}
	}
}
