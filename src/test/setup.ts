import 'jest';
import * as db from '../db/index';


beforeAll(async()=>{
    // console.log("test")
    await db.query(`CREATE TABLE IF NOT EXISTS events (id SERIAL PRIMARY KEY, name VARCHAR(255), type VARCHAR(255), description VARCHAR(255));`, null);
    // await pool.query(`CREATE TABLE IF NOT EXISTS...`); // Example setup
    // pool.end();
});

// afterAll(async () => {
//     const pool = new Pool(testDbConfig);
//     // Any teardown (e.g., dropping tables)
//     await pool.query(`DROP TABLE IF EXISTS...`); // Example teardown
//     pool.end();
//   });