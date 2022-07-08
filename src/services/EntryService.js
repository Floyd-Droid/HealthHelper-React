const defaultError = {errorMessage: 'Something went wrong. Please check your connection and try again.'}
const authError = {errorMessage: 'You must log in before attempting to create or alter entries.'}

export async function getEntries(url, firebaseIdToken) {
	if (firebaseIdToken === null) {
		return authError;
	}

  try {
    const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${firebaseIdToken}`,
			},
		});

    return res.json();
  } catch (err) {
    return defaultError;
  }
}

export async function updateEntries(url, firebaseIdToken, entries) {
	if (firebaseIdToken === null) {
		return authError;
	}

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${firebaseIdToken}`,
			},
      body: JSON.stringify(entries)
    });

    return res.json();
  } catch (err) {
    return defaultError;
  }
} 

export async function createEntries(url, firebaseIdToken, entries) {
	if (firebaseIdToken === null) {
		return authError;
	}

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${firebaseIdToken}`,
			},
      body: JSON.stringify(entries)
    });

    return res.json();
  } catch (err) {
    return defaultError;
  }
}

export async function deleteEntries(url, firebaseIdToken, entries) {
	if (firebaseIdToken === null) {
		return authError;
	}

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${firebaseIdToken}`,
			},
      body: JSON.stringify(entries)
    });

    return res.json();
  } catch(err) {
    return defaultError;
  }
}
