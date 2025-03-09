import { Pool } from 'pg';
 
const defaultDbConfig = {
    user: 'youruser',
    host: 'localhost',
    database: 'yourtestdatabase',
    password: 'yourpassword',
    port: 5432,
};
  
  // Test configuration
const testDbConfig = {
    user: 'youruser',
    host: 'localhost',
    database: 'yourtestdatabase',
    password: 'yourpassword',
    port: 5432,
};

const isTestEnvironment = process.env.NODE_ENV === 'test';
const dbConfig = isTestEnvironment ? testDbConfig : defaultDbConfig;

const pool = new Pool(dbConfig)
export const query = async (text: string, params: any) => {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
}

export const getClient = async () => {
    const client = await pool.connect();
    return client
}