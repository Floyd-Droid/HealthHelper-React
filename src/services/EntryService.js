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
      if (typeof createBody.errorMessage === 'undefined') {
        result.successMessages.push(createBody.successMessage)
      } else {
        result.errorMessages.push(createBody.errorMessage)
      }
    }
    if (editedEntries.length) {
      const updateBody = await updateEntries(url, editedEntries);
      if (typeof updateBody.errorMessage === 'undefined') {
        result.successMessages.push(updateBody.successMessage)
      } else {
        result.errorMessages.push(updateBody.errorMessage)
      }
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