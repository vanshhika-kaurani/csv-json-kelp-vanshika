function convertToNestedJSON(flatRecords) {
  return flatRecords.map(flatRecord => {
    const nestedObject = {};

    Object.keys(flatRecord).forEach(key => {
      const value = flatRecord[key];
      if (key.includes('.')) {
        const parts = key.split('.');
        setNestedProperty(nestedObject, parts, value);
      } else {
        nestedObject[key] = value;
      }
    });

    return nestedObject;
  });
}

function setNestedProperty(obj, parts, value) {
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) current[part] = {};
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

function transformForDatabase(nestedRecords) {
  return nestedRecords.map(record => {
    const firstName = record.name?.firstName || '';
    const lastName = record.name?.lastName || '';
    const age = parseInt(record.age) || 0;
    const address = record.address || null;

    const fullName = `${firstName} ${lastName}`.trim();

    const additionalInfo = {};
    Object.keys(record).forEach(key => {
      if (key !== 'name' && key !== 'age' && key !== 'address') {
        additionalInfo[key] = record[key];
      }
    });

    return {
      name: fullName,
      age: age,
      address: address,
      additional_info:
        Object.keys(additionalInfo).length > 0 ? additionalInfo : null,
    };
  });
}

module.exports = { convertToNestedJSON, transformForDatabase };
