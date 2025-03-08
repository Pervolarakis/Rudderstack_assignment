import { getAllEvents, createEvent } from '../events';
import * as db from '../../db/index';

// Mock the db module
jest.mock('../../db/index');

describe('getAllEvents function', () => {
    it('should return all events from the database', async () => {
        // Mock the query function to return a specific result
        const mockRows = [
            {
                id: 1,
                name: 'Test Event',
                date: '2023-01-01',
                description: 'This is a test event'
            }
        ];
        
        // @ts-ignore
        db.query.mockImplementation((text, params) => {
            return { rows: mockRows };
        });

        const result = await getAllEvents();
        
        expect(result).toEqual(mockRows);
        expect(result[0].name).toBe('Test Event');
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM events', null);
    });

    it('should return empty array if no events exist', async () => {
        // Mock the query function to return empty result
        const mockRows = [];
        
        // @ts-ignore
        db.query.mockImplementation((text, params) => {
            return { rows: mockRows };
        });

        const result = await getAllEvents();
        
        expect(result).toEqual([]);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM events', null);
    });
});

describe('createEvent function', () => {
    const mockEvent = {
        name: 'New Event',
        type: 'Conference',
        description: 'This is a new event',
    };

    it('should insert a new event into the database and return the inserted event', async () => {
        // Mock the query function to return a specific result
        //@ts-ignore
        db.query.mockResolvedValue({
            rows: [mockEvent]
        });

        const result = await createEvent(mockEvent);

        // Verify the result
        expect(result).toEqual([mockEvent]);

        // Verify the query was called with the correct SQL and parameters
        expect(db.query).toHaveBeenCalledWith(
            `INSERT INTO events (name, type, description) VALUES ($1, $2, $3)`,
            [mockEvent.name, mockEvent.type, mockEvent.description]
        );
    });

    it('should handle errors gracefully and return undefined', async () => {
        // Mock the query function to throw an error
        //@ts-ignore
        db.query.mockRejectedValue(new Error('Database error'));

        const result = await createEvent(mockEvent);

        // Verify the result
        expect(result).toBeUndefined();

        // Verify the query was called with the correct SQL and parameters
        expect(db.query).toHaveBeenCalledWith(
            `INSERT INTO events (name, type, description) VALUES ($1, $2, $3)`,
            [mockEvent.name, mockEvent.type, mockEvent.description]
        );
    });
});