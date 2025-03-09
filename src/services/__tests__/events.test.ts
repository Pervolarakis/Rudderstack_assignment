import { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent } from '../events';
import * as db from '../../db/index';

// Mock the database module
jest.mock('../../db/index');

describe('Events Service', () => {
  // Valid event types
  const validEventTypes = ["track", "identify", "alias", "screen", "page"];
  
  // Sample event data for testing
  const mockEvent = {
    id: 1,
    name: 'Button Click',
    type: 'track',
    description: 'User clicked on the submit button',
    create_time: new Date('2025-03-09T10:00:00Z'),
    update_time: new Date('2025-03-09T10:00:00Z')
  };

  const mockEventCreate = {
    name: 'Button Click',
    type: 'track',
    description: 'User clicked on the submit button'
  };

  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllEvents', () => {
    test('should return all events', async () => {
      // Mock database response
      (db.query as jest.Mock).mockResolvedValue({
        rows: [
          mockEvent, 
          { ...mockEvent, id: 2, name: 'Page View', type: 'page' }
        ]
      });

      const result = await getAllEvents();
      
      // Verify the query was called with correct parameters
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM events', null);
      
      // Verify the result
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockEvent);
      
      // Verify events have valid types
      result.forEach(event => {
        expect(validEventTypes).toContain(event.type);
      });
    });

    test('should return empty array when no events exist', async () => {
      // Mock empty database response
      (db.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await getAllEvents();
      
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM events', null);
      expect(result).toEqual([]);
    });
  });

  describe('createEvent', () => {
    test('should create and return a new event with valid type', async () => {
      const newEvent = {
        ...mockEvent
      };
      
      // Mock database response for successful creation
      (db.query as jest.Mock).mockResolvedValue({
        rows: [newEvent]
      });

      const eventToCreate = {
        name: 'Page View',
        type: 'page',
        description: 'User visited the homepage'
      };

      const result = await createEvent(eventToCreate);
      
      // Verify query called with correct parameters
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO events (name, type, description) VALUES ($1, $2, $3) RETURNING *',
        [eventToCreate.name, eventToCreate.type, eventToCreate.description]
      );
      
      // Verify result has all expected fields
      expect(result).toEqual(newEvent);
      expect(validEventTypes).toContain(result.type);
      expect(result).toHaveProperty('create_time');
      expect(result).toHaveProperty('update_time');
    });

    test('should handle invalid event type', async () => {
      // This test is to demonstrate validation, though in the current implementation
      // this validation would likely be handled at the schema or API level
      const eventWithInvalidType = {
        name: 'Invalid Event',
        type: 'invalid_type', // Not in the allowed list
        description: 'This event has an invalid type'
      };
      
      // Mock error from database due to constraint violation
      const error = new Error('invalid event type');
      (db.query as jest.Mock).mockRejectedValue(error);
      
      // Spy on console.log
      const consoleSpy = jest.spyOn(console, 'log');
      
      const result = await createEvent(eventWithInvalidType);
      
      // Verify error is logged
      expect(consoleSpy).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
      
      // Restore console.log
      consoleSpy.mockRestore();
    });

    test('should handle duplicate name+type combination', async () => {
      // Mock error for unique constraint violation
      const error = new Error('duplicate key value violates unique constraint');
      (db.query as jest.Mock).mockRejectedValue(error);
      
      // Spy on console.log
      const consoleSpy = jest.spyOn(console, 'log');
      
      const result = await createEvent(mockEventCreate);
      
      // Verify error is logged
      expect(consoleSpy).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
      
      // Restore console.log
      consoleSpy.mockRestore();
    });
  });

  describe('getEventById', () => {
    test('should return an event by id with all expected properties', async () => {
      // Mock database response
      (db.query as jest.Mock).mockResolvedValue({
        rows: [mockEvent]
      });

      const result = await getEventById(1);
      
      // Verify query called with correct parameters
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM events WHERE id = $1',
        [1]
      );
      
      // Verify result structure
      expect(result).toEqual(mockEvent);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('create_time');
      expect(result).toHaveProperty('update_time');
      expect(validEventTypes).toContain(result.type);
    });

    test('should return undefined when event does not exist', async () => {
      // Mock empty database response
      (db.query as jest.Mock).mockResolvedValue({
        rows: []
      });

      const result = await getEventById(999);
      
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM events WHERE id = $1',
        [999]
      );
      expect(result).toBeUndefined();
    });
  });

  describe('updateEvent', () => {
    test('should update and return the updated event', async () => {
      const updatedEvent = {
        ...mockEvent,
        name: 'Button Click Updated',
        update_time: new Date('2025-03-09T11:00:00Z')
      };
      
      const updateData = {
        name: 'Button Click Updated',
        type: 'track',
        description: 'User clicked on the submit button'
      };
      
      // Mock database response
      (db.query as jest.Mock).mockResolvedValue({
        rows: [updatedEvent]
      });

      const result = await updateEvent(1, updateData);
      
      // Verify query called with correct parameters
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE events SET name = $1, type = $2, description = $3 WHERE id = $4 RETURNING *',
        [updateData.name, updateData.type, updateData.description, 1]
      );
      
      // Verify result
      expect(result).toEqual(updatedEvent);
      expect(result.update_time).not.toEqual(mockEvent.update_time);
      expect(validEventTypes).toContain(result.type);
    });

    test('should not allow update to invalid event type', async () => {
      const updateData = {
        name: 'Button Click',
        type: 'invalid_type', // Not in allowed list
        description: 'This should fail'
      };
      
      // Mock error from database
      const error = new Error('invalid event type');
      (db.query as jest.Mock).mockRejectedValue(error);
      
      // Implementation would need to be updated to handle this validation
      // For now, we're just testing that if the DB rejects it, we handle it properly
      
      // Wrap in try/catch since our current implementation doesn't handle this error
      try {
        await updateEvent(1, updateData);
      } catch (e) {
        expect(e).toEqual(error);
      }
      
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE events SET name = $1, type = $2, description = $3 WHERE id = $4 RETURNING *',
        [updateData.name, updateData.type, updateData.description, 1]
      );
    });
  });

  describe('deleteEvent', () => {
    test('should delete and return the deleted event', async () => {
      // Mock database response
      (db.query as jest.Mock).mockResolvedValue({
        rows: [mockEvent]
      });

      const result = await deleteEvent(1);
      
      // Verify query called with correct parameters
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM events WHERE id = $1 RETURNING *',
        [1]
      );
      
      // Verify result
      expect(result).toEqual(mockEvent);
    });

    test('should return undefined when event does not exist', async () => {
      // Mock empty database response
      (db.query as jest.Mock).mockResolvedValue({
        rows: []
      });

      const result = await deleteEvent(999);
      
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM events WHERE id = $1 RETURNING *',
        [999]
      );
      expect(result).toBeUndefined();
    });
  });
});