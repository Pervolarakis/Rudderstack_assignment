import * as eventsService from "../services/events";
import { event_create } from "../types";

const getAllEvents = async () => {
    return await eventsService.getAllEvents();
}

const createEvent = async (event: event_create) => {
    return await eventsService.createEvent(event);
}

export {getAllEvents, createEvent};