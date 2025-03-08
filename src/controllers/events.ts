import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";
import * as eventsService from "../services/events";
import { event_create } from "../types";

const getAllEvents = async () => {
    return await eventsService.getAllEvents();
}

const createEvent = async (event: event_create) => {
    return await eventsService.createEvent(event);
}

const updateEvent = async (id: number, event: event_create) => {
    const findEvent = await eventsService.getEventById(id);
    if (!findEvent) {
        throw new ResourceNotFoundError('event');
    }
    return await eventsService.updateEvent(id, event);
}

const deleteEvent = async (id: number) => {
    const findEvent = await eventsService.getEventById(id);
    if (!findEvent) {
        throw new ResourceNotFoundError('event');
    }
    return await eventsService.deleteEvent(id);
}

export {getAllEvents, createEvent, updateEvent, deleteEvent};