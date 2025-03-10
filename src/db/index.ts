import { Pool } from 'pg';
 
const defaultDbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};
  
  // Test configuration
const testDbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

const isTestEnvironment = process.env.NODE_ENV === 'test';
const dbConfig = isTestEnvironment ? testDbConfig : defaultDbConfig;
//@ts-ignore
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