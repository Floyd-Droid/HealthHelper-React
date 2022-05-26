const convertEmptyStringToNull = (entries) => {
  for (let entry of entries) {
    Object.keys(entry).forEach((key) => {
        entry[key] = entry[key] === '' ? null : entry[key];
    })
  }
  
  return entries;
}

module.exports = {
  convertEmptyStringToNull
}