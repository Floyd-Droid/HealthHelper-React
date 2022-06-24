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