import * as db from '../db/index'
import { event_create } from '../types';

const getAllEvents = async () => {
    const events = await db.query(`SELECT * FROM events`, null);
    return events.rows;
}

const createEvent = async (event: event_create) => {
    try {
        const events = await db.query(`INSERT INTO events (name, type, description) VALUES ($1, $2, $3)`, [event.name, event.type, event.description]);
        return events.rows;
    } catch (error) {
        console.log(error)
    }
}

export {getAllEvents, createEvent};