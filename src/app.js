require('dotenv').config();
const express = require('express');
const path = require('path');
const { initializeDatabase, pool } = require('./config/database');
const { parseCSV } = require('./utils/csvParser');
const { convertToNestedJSON, transformForDatabase } = require('./utils/jsonConverter');
const { insertUsers, calculateAgeDistribution, clearUsers } = require('./services/userService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function processCSVFile() {
  try {
    console.log('\nStarting CSV to JSON conversion process...\n');

    console.log('Step 1: Reading CSV file...');
    const csvFilePath = path.resolve(process.env.CSV_FILE_PATH);
    const flatRecords = await parseCSV(csvFilePath);
    
    if (flatRecords.length === 0) {
      console.log('No records found');
      return;
    }

    console.log('\n Step 2: Converting to nested JSON...');
    const nestedRecords = convertToNestedJSON(flatRecords);
    console.log(`Converted ${nestedRecords.length} records`);

    console.log('\n Step 3: Transforming for database...');
    const dbRecords = transformForDatabase(nestedRecords);
    console.log(`Transformed ${dbRecords.length} records`);

    console.log('\n Step 4: Inserting into database...');
    await insertUsers(dbRecords);

    console.log('\n Step 5: Calculating age distribution...');
    await calculateAgeDistribution();

    console.log('\n Process completed!\n');

  } catch (error) {
    console.error('\n Error:', error.message);
    throw error;
  }
}

app.post('/api/upload', async (req, res) => {
  try {
    await processCSVFile();
    res.json({ success: true, message: 'CSV processed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'CSV to JSON Converter API' });
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`\n Server running on http://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  console.log('\n Shutting down...');
  await pool.end();
  process.exit(0);
});