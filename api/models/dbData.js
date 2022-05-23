const convertEmptyStringToNull = (entries) => {
  for (let entry of entries) {

    Object.keys(entry).forEach((key) => {
        entry[key] = entry[key] === '' ? null : entry[key];
    })
  }
  console.log('prepared for update: ', entries)
  return entries;
}

module.exports = {
  convertEmptyStringToNull
}