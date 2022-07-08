import admin from 'firebase-admin';
import 'dotenv/config';

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.PROJECT_ID,
		privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
		clientEmail: process.env.CLIENT_EMAIL,
	})
})

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
