export async function getEntries(url, firebaseIdToken) {
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
    console.log(err);
  }
}

export async function updateEntries(url, firebaseIdToken, entries) {
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
    console.log(err);
  }
} 


export async function createEntries(url, firebaseIdToken, entries) {
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
    console.log(err);
  }
}

export async function createOrUpdateEntries(url, firebaseIdToken, newEntries, editedEntries) {
  const result = {successMessages: [], errorMessages: []};

  try {
    if (newEntries.length) {
      const createBody = await createEntries(url, firebaseIdToken, newEntries);
			result.successMessages.push(...createBody.successMessages);
			result.errorMessages.push(...createBody.errorMessages);
    }
    if (editedEntries.length) {
      const updateBody = await updateEntries(url, firebaseIdToken, editedEntries);
			result.successMessages.push(...updateBody.successMessages);
			result.errorMessages.push(...updateBody.errorMessages);
    }

    return result;
  } catch(err) {
    console.log(err);
  }
}

export async function deleteEntries(url, firebaseIdToken, entries) {
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
    console.log(err);
  }
}