## 🚀 CSV to JSON Converter API with PostgreSQL Integration


### 1️⃣ CSV Parsing
- The CSV file is read using Node.js `fs` module.
- Each line is split into headers and values to create data records.
- Handles commas, quotes, and empty lines manually.

### 2️⃣ Custom Parser
- Built without using any external CSV library.
- Implements manual parsing logic for flexibility and accuracy.
- Ensures every line is processed even with missing or quoted values.

### 3️⃣ Nested JSON Conversion
- Keys with dot notation (e.g., `name.firstName`) are converted into nested JSON objects.
- Uses recursion to create hierarchical JSON structure dynamically.

### 4️⃣ Data Transformation
- Combines related fields like `firstName` and `lastName` into a single `name` field.
- Converts data types (e.g., `age` to integer) before database insertion.
- Prepares structured data for PostgreSQL compatibility.

### 5️⃣ PostgreSQL Integration
- Uses `pg` module to connect Node.js with PostgreSQL.
- Stores data in `JSONB` columns for flexible, schema-less storage.
- Ensures safe data transactions using `BEGIN`, `COMMIT`, and `ROLLBACK`.

### 6️⃣ Age Distribution Calculation
- After insertion, SQL queries are used to calculate user distribution by age groups.
- Displays percentage and count for each range (`<20`, `20–40`, `40–60`, `>60`).

### 7️⃣ Environment Configuration
- `.env` file stores database credentials, port, and CSV file path.
- Uses `dotenv` for loading environment variables securely.

### 8️⃣ Scalability & Error Handling
- Can handle 50,000+ records efficiently (supports batching or streaming improvements).
- Includes error handling for missing files, invalid data, and DB connection issues.

## 🧪 Sample Output

Below is an example of the console output after successfully parsing the CSV file, converting it to nested JSON, inserting records into PostgreSQL, and generating the age distribution report:


<img width="752" height="786" alt="Screenshot 2025-10-27 155833" src="https://github.com/user-attachments/assets/d94d1dc8-7560-4565-83f4-15cd51b2681c" />

