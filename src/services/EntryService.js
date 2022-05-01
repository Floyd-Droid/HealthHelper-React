async function getEntries(url) {
  try {
    const res = await fetch(url);
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

async function updateEntries(url, entries) {
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

async function createEntries(url, entries) {
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

async function createOrUpdateEntries(url, newEntries, editedEntries) {
  let createRes, updateRes;

  try {
    if (newEntries.length) {
      createRes = await createEntries(url, newEntries);
    }
    if (editedEntries.length) {
      updateRes = await updateEntries(url, editedEntries);
    }
    return [createRes, updateRes];
  } catch(err) {
    console.log(err);
  }
}

function prepareForUpdate(entries) {
  // Convert entry values to datatbase-appropriate values

  const stringKeys = ['name', 'weight_unit', 'volume_unit', 'amount_unit'];
  for (let entry of entries) {

    Object.keys(entry).forEach((key) => {
      if (stringKeys.includes(key)) {
        entry[key] = entry[key] === '' ? null : String(entry[key]);
      } else {
        entry[key] = entry[key] === '' ? null : Number(entry[key]);
      }
    })
  }
  return entries;
}

module.exports = {
  createOrUpdateEntries,
  getEntries,
  updateEntries,
  prepareForUpdate
}