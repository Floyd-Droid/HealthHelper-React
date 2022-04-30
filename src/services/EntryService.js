async function getEntries(url) {
    try {
      const res = await fetch(url);
      return res.json();
    } catch (err) {
      console.log(err)
    }
  }

async function updateEntryData(url, entryData) {
  // Update all rows that have been edited by the user
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData)
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

function prepareForDbUpdate(entries) {
  // Convert entry values to datatbase-appropriate values

  const stringKeys = ['name', 'weight_unit', 'volume_unit', 'amount_unit']
  for (let entry of entries) {

    Object.keys(entry).forEach((key) => {
      if (stringKeys.includes(key)) {
        entry[key] = entry[key] === '' ? null : String(entry[key])
      } else {
        entry[key] = entry[key] === '' ? null : Number(entry[key]);
      }
    })
  }
  return entries;
}


module.exports = {
  getEntries,
  updateEntryData,
  prepareForDbUpdate
}