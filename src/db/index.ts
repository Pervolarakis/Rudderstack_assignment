import { Pool } from 'pg';
 
const testDbConfig = {
    user: 'youruser',
    host: 'localhost',
    database: 'yourtestdatabase',
    password: 'yourpassword',
    port: 5432,
};

const pool = new Pool(testDbConfig)
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