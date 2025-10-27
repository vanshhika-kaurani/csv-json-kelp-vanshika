const { pool } = require('../config/database');

async function insertUsers(users) {
  const client = await pool.connect();
  const batchSize = 1000;
  let insertedCount = 0;

  try {
    await client.query('BEGIN');

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      const values = [];
      const placeholders = [];

      batch.forEach((user, index) => {
        const base = index * 4;
        placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
        values.push(
          user.name,
          user.age,
          user.address ? JSON.stringify(user.address) : null,
          user.additional_info ? JSON.stringify(user.additional_info) : null
        );
      });

      const query = `
        INSERT INTO public.users (name, age, address, additional_info)
        VALUES ${placeholders.join(',')}
      `;

      await client.query(query, values);
      insertedCount += batch.length;
    }

    await client.query('COMMIT');
    console.log(`Inserted ${insertedCount} records into database`);
    return insertedCount;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting users:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function calculateAgeDistribution() {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM public.users');
    const total = parseInt(totalResult.rows[0].total);

    if (total === 0) {
      console.log('No users in database');
      return;
    }

    const queries = {
      '< 20': 'SELECT COUNT(*) FROM public.users WHERE age < 20',
      '20-40': 'SELECT COUNT(*) FROM public.users WHERE age >= 20 AND age <= 40',
      '40-60': 'SELECT COUNT(*) FROM public.users WHERE age > 40 AND age <= 60',
      '> 60': 'SELECT COUNT(*) FROM public.users WHERE age > 60'
    };

    console.log('\n' + '═'.repeat(55));
    console.log('AGE DISTRIBUTION REPORT');
    console.log('═'.repeat(55));

    for (const [label, query] of Object.entries(queries)) {
      const result = await pool.query(query);
      const count = parseInt(result.rows[0].count);
      const percent = ((count / total) * 100).toFixed(2);
      console.log(`${label.padEnd(20)} | ${percent}% (${count})`);
    }

    console.log('═'.repeat(55) + '\n');
  } catch (error) {
    console.error('Error calculating age distribution:', error);
    throw error;
  }
}

async function clearUsers() {
  try {
    await pool.query('TRUNCATE TABLE public.users RESTART IDENTITY');
    console.log('Cleared all users from database');
  } catch (error) {
    console.error('Error clearing users:', error);
    throw error;
  }
}

module.exports = { insertUsers, calculateAgeDistribution, clearUsers };
