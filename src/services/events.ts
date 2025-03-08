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

const getEventById = async (id: number) => {
    const event = await db.query(`SELECT * FROM events WHERE id = $1`, [id]);
    return event.rows[0];
}

const updateEvent = async (id: number, event: event_create) => {
    const events = await db.query(`UPDATE events SET name = $1, type = $2, description = $3 WHERE id = $4`, [event.name, event.type, event.description, id]);
    return events.rows[0];
}

const deleteEvent = async (id: number) => {
    const events = await db.query(`DELETE FROM events WHERE id = $1`, [id]);
    return events.rows[0];
}

export {getAllEvents, createEvent, getEventById, updateEvent, deleteEvent};