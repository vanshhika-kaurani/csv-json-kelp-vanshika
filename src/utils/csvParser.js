const fs = require('fs');
const readline = require('readline');

async function parseCSV(filePath) {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      let headers = [];
      const records = [];
      let lineNumber = 0;

      for await (const line of rl) {
        lineNumber++;
        if (!line.trim()) continue; // skip empty lines

        if (lineNumber === 1) {
          headers = parseCSVLine(line);
          continue;
        }

        const values = parseCSVLine(line);
        if (values.length !== headers.length) {
          console.warn(`Skipping malformed line ${lineNumber}`);
          continue;
        }

        const record = {};
        for (let i = 0; i < headers.length; i++) {
          record[headers[i].trim()] = values[i].trim();
        }

        records.push(record);
      }

      console.log(`Parsed ${records.length} records from CSV`);
      resolve(records);
    } catch (error) {
      reject(new Error(`Error parsing CSV: ${error.message}`));
    }
  });
}

// Handles commas inside quotes
function parseCSVLine(line) {
  const values = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentValue += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue);
  return values;
}

module.exports = { parseCSV };
