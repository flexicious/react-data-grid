

import { Pool } from 'pg';
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({
    connectionString: connectionString,
  });

export const getDataFromPostgres = async<T>(sql: string, params: any[]): Promise<T[]> => {
    let i = 0;
    const query = sql.replace(/\?/g, (match, offset) => `$${++i}`);
    const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release()
  }
}
