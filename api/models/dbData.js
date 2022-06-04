const convertEmptyStringToNull = (entries) => {
  for (let entry of entries) {
    Object.keys(entry).forEach((key) => {
        entry[key] = entry[key] === '' ? null : entry[key];
    })
  }
  
  return entries;
}

const makeEntryNameList = (entryNames) => {
	// return a string of comma separated entry names
	let result = '';
	entryNames.forEach((entryName, i) => {
		if (i === entryNames.length - 1) {
			result += `${entryName}.`;
		} else {
			result += `${entryName}, `;
		}
	})

	return result;
}

module.exports = {
  convertEmptyStringToNull,
	makeEntryNameList
}