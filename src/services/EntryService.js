async function getEntries(url) {
  try {
    const res = await fetch(url);
    return res;
  } catch (err) {
    console.log('err in getEntries: ', err);
  }
}

async function updateEntries(url, entries) {
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries)
    });

    return res;
  } catch (err) {
    console.log('err in updateEntries: ', err);
  }
} 


async function createEntries(url, entries) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries)
    });
    return res;
  } catch (err) {
    console.log(err);
  }
}

async function createOrUpdateEntries(url, newEntries, editedEntries) {
  let result = {messages: [], errors: []};

  try {
    if (newEntries.length) {
      const createRes = await createEntries(url, newEntries);
      if (createRes.ok) {
        result.messages.push('Creation successful');
      } else {
        result.errors.push('Creation failed');
      }
    }
    if (editedEntries.length) {
      const updateRes = await updateEntries(url, editedEntries);
      if (updateRes.ok) {
        result.messages.push('Update successful');
      } else {
        result.errors.push('Update failed');
      }
    }

    return result;
  } catch(err) {
    console.log(err);
  }
}

async function getLogAndIndexEntries(logUrl, indexUrl) {
  let result = {logEntries: [], indexEntries: [], messages: [], errors: []};

  try {

    const logRes = await getEntries(logUrl);
    if (logRes.ok) {
      let body = await logRes.json();
      result.logEntries = body.entries;
    } else {
      result.errors.push('Could not get log entries');
    }

    const indexRes = await getEntries(indexUrl);
    if (indexRes.ok) {
      let body = await indexRes.json();
      result.indexEntries = body.entries;
    } else {
      result.errors.push('Could not get index entries');
    }

    return result;
  } catch(err) {
    console.log(err);
  }
}

async function deleteEntries(url, entryIds) {

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(entryIds)
    });

    return res;
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
  createEntries,
  createOrUpdateEntries,
  deleteEntries,
  getEntries,
  getLogAndIndexEntries,
  updateEntries,
  prepareForUpdate
}