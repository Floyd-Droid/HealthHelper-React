export async function getEntries(url) {
  try {
    const res = await fetch(url);
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function updateEntries(url, entries) {
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries)
    });

    return res.json();
  } catch (err) {
    console.log(err);
  }
} 


export async function createEntries(url, entries) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries)
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function createOrUpdateEntries(url, newEntries, editedEntries) {
  const result = {successMessages: [], errorMessages: []};

  try {
    if (newEntries.length) {
      const createBody = await createEntries(url, newEntries);
			result.successMessages.push(...createBody.successMessages);
			result.errorMessages.push(...createBody.errorMessages);
    }
    if (editedEntries.length) {
      const updateBody = await updateEntries(url, editedEntries);
			result.successMessages.push(...updateBody.successMessages);
			result.errorMessages.push(...updateBody.errorMessages);
    }

    return result;
  } catch(err) {
    console.log(err);
  }
}

export async function deleteEntries(url, entries) {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(entries)
    });

    return res.json();
  } catch(err) {
    console.log(err);
  }
}