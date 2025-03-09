import request from 'supertest';
import * as eventsController from '../../controllers/events';
import {app} from '../../app';
// Mock the events controller

jest.mock('../../controllers/events');

describe('Events Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/events', () => {
    it('should return all events', async () => {
      const mockEvents = [
        { id: 1, name: 'Event 1', type: 'track', description: 'First event' },
        { id: 2, name: 'Event 2', type: 'page', description: 'Second event' }
      ];
      
      (eventsController.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);
      
      const response = await request(app)
        .get('/api/v1/events')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toEqual(mockEvents);
      expect(eventsController.getAllEvents).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      (eventsController.getAllEvents as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      await request(app)
        .get('/api/v1/events')
        .expect(400);
    });
  });

  describe('POST /api/v1/events', () => {
    it('should create a new event', async () => {
      const eventData = { 
        name: 'New Event',
        type: 'track',
        description: 'Event description'
      };
      
      const createdEvent = { 
        id: 1,
        ...eventData
      };
      
      (eventsController.createEvent as jest.Mock).mockResolvedValue(createdEvent);
      
      const response = await request(app)
        .post('/api/v1/events')
        .send(eventData)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toEqual(createdEvent);
      expect(eventsController.createEvent).toHaveBeenCalledWith(eventData);
    });

    it('should validate request body', async () => {
      const invalidEvent = {
        name: 'Invalid Event',
        type: 'invalid-type', // Not in the allowed list
        description: 'Event description'
      };
      
      await request(app)
        .post('/api/v1/events')
        .send(invalidEvent)
        .expect(400);
      
      expect(eventsController.createEvent).not.toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const incompleteEvent = {
        // Missing name
        type: 'track',
        description: 'Event description'
      };
      
      await request(app)
        .post('/api/v1/events')
        .send(incompleteEvent)
        .expect(400);
      
      expect(eventsController.createEvent).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/v1/events/:id', () => {
    it('should update an existing event', async () => {
      const eventId = 1;
      const eventData = { 
        name: 'Updated Event',
        type: 'identify',
        description: 'Updated description'
      };
      
      const updatedEvent = { 
        id: eventId,
        ...eventData
      };
      
      (eventsController.updateEvent as jest.Mock).mockResolvedValue(updatedEvent);
      
      const response = await request(app)
        .put(`/api/v1/events/${eventId}`)
        .send(eventData)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toEqual(updatedEvent);
      expect(eventsController.updateEvent).toHaveBeenCalledWith(eventId, eventData);
    });

    it('should validate request body for updates', async () => {
      const eventId = 1;
      const invalidEvent = {
        name: 'Updated Event',
        type: 'invalid-type', // Not in the allowed list
        description: 'Updated description'
      };
      
      await request(app)
        .put(`/api/v1/events/${eventId}`)
        .send(invalidEvent)
        .expect(400);
      
      expect(eventsController.updateEvent).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/v1/events/:id', () => {
    it('should delete an event', async () => {
      const eventId = 1;
      const deletedEvent = { id: eventId, deleted: true };
      
      (eventsController.deleteEvent as jest.Mock).mockResolvedValue(deletedEvent);
      
      const response = await request(app)
        .delete(`/api/v1/events/${eventId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toEqual(deletedEvent);
      expect(eventsController.deleteEvent).toHaveBeenCalledWith(eventId);
    });

    it('should handle non-existent event', async () => {
      const nonExistentId = 999;
      
      (eventsController.deleteEvent as jest.Mock).mockResolvedValue(null);
      
      const response = await request(app)
        .delete(`/api/v1/events/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toBeNull();
      expect(eventsController.deleteEvent).toHaveBeenCalledWith(nonExistentId);
    });
  });
});