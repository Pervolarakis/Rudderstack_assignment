import 'jest';
import { Pool } from 'pg';

const testDbConfig = {
    user: 'youruser',
    host: 'localhost',
    database: 'yourtestdatabaseaaa',
    password: 'yourpassword',
    port: 5432,
  };

beforeAll(async()=>{
    const pool = new Pool(testDbConfig);
    // console.log("test")
    // await pool.query(`CREATE TABLE IF NOT EXISTS...`); // Example setup
    // pool.end();
});

// afterAll(async () => {
//     const pool = new Pool(testDbConfig);
//     // Any teardown (e.g., dropping tables)
//     await pool.query(`DROP TABLE IF EXISTS...`); // Example teardown
//     pool.end();
//   });