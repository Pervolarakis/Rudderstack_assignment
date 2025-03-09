import * as db from '../../db/index';
import { AllreadyExistsError } from '../../errors/AlreadyExistsError';
import { 
  getAllTrackingPlans, 
  createTrackingPlan, 
  getTrackingPlanById,
  updateTrackingPlan,
  deleteTrackingPlans
} from '../trackingPlans';
import { create_tracking_plan } from '../../types';
import { QueryResult } from 'pg';

// Mock the database module
jest.mock('../../db/index');

// Helper function to create a valid QueryResult
function createQueryResult(rows: any[]): QueryResult {
  return {
    rows,
    command: 'SELECT',
    rowCount: rows.length,
    oid: 0,
    fields: []
  };
}

describe('Tracking Plans Service', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTrackingPlans', () => {
    it('should return all tracking plans with events and properties', async () => {
      // Mock the db.query function
      const mockQuery = db.query as jest.MockedFunction<typeof db.query>;
      
      // First call: get all tracking plans
      mockQuery.mockResolvedValueOnce(createQueryResult([
        { id: 1, name: 'Purchase Flow', description: 'Tracking plan for purchase flow' },
        { id: 2, name: 'User Authentication', description: 'Tracking plan for user auth' }
      ]));

      // Second call: get events for tracking plan 1
      mockQuery.mockResolvedValueOnce(createQueryResult([
        { 
          id: 101, 
          name: 'Product Viewed', 
          type: 'track', 
          description: 'When user views a product', 
          additional_properties_allowed: true 
        },
        { 
          id: 102, 
          name: 'Add to Cart', 
          type: 'track', 
          description: 'When user adds product to cart', 
          additional_properties_allowed: false 
        }
      ]));

      // Third call: get properties for event 101
      mockQuery.mockResolvedValueOnce(createQueryResult([
        { 
          id: 1001, 
          name: 'product_id', 
          type: 'string', 
          description: 'ID of the product', 
          required: true 
        },
        { 
          id: 1002, 
          name: 'product_name', 
          type: 'string', 
          description: 'Name of the product', 
          required: true 
        }
      ]));

      // Fourth call: get properties for event 102
      mockQuery.mockResolvedValueOnce(createQueryResult([
        { 
          id: 1003, 
          name: 'product_id', 
          type: 'string', 
          description: 'ID of the product', 
          required: true 
        },
        { 
          id: 1004, 
          name: 'quantity', 
          type: 'number', 
          description: 'Quantity added to cart', 
          required: true 
        }
      ]));

      // Fifth call: get events for tracking plan 2
      mockQuery.mockResolvedValueOnce(createQueryResult([
        { 
          id: 103, 
          name: 'User Login', 
          type: 'track', 
          description: 'When user logs in', 
          additional_properties_allowed: false 
        }
      ]));

      // Sixth call: get properties for event 103
      mockQuery.mockResolvedValueOnce(createQueryResult([
        { 
          id: 1005, 
          name: 'user_id', 
          type: 'string', 
          description: 'ID of the user', 
          required: true 
        },
        { 
          id: 1006, 
          name: 'login_method', 
          type: 'string', 
          description: 'Method of login', 
          required: true 
        }
      ]));

      const result = await getAllTrackingPlans();

      // Assertions
      expect(result).toHaveLength(2);
      
      // Check first tracking plan
      expect(result[0].name).toBe('Purchase Flow');
      expect(result[0].events).toHaveLength(2);
      expect(result[0].events[0].name).toBe('Product Viewed');
      expect(result[0].events[0].additionalProperties).toBe(true);
      expect(result[0].events[0].properties).toHaveLength(2);
      expect(result[0].events[0].properties[0].name).toBe('product_id');
      expect(result[0].events[0].properties[0].required).toBe(true);
      
      // Check second tracking plan
      expect(result[1].name).toBe('User Authentication');
      expect(result[1].events).toHaveLength(1);
      expect(result[1].events[0].name).toBe('User Login');
      expect(result[1].events[0].properties).toHaveLength(2);
    });

    it('should return empty array when no tracking plans exist', async () => {
      // Mock the db.query function to return empty rows
      (db.query as jest.Mock).mockResolvedValueOnce(createQueryResult([]));

      const result = await getAllTrackingPlans();

      expect(result).toHaveLength(0);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      // Mock the db.query function to throw an error
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(getAllTrackingPlans()).rejects.toThrow('Database error');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTrackingPlan', () => {
    const mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };

    it('should create a new tracking plan with events and properties', async () => {
      // Mock getClient to return our mock client
      (db.getClient as jest.Mock).mockResolvedValue(mockClient);

      const trackingPlan: create_tracking_plan = {
        name: 'New Tracking Plan',
        description: 'Test description',
        events: [
          {
            name: 'Test Event',
            description: 'Test event description',
            type: 'track',
            additionalProperties: 'false',
            properties: [
              {
                name: 'test_property',
                type: 'string',
                required: true,
                description: 'Test property description'
              }
            ]
          }
        ]
      };

      // Mock transaction queries
      mockClient.query.mockImplementation((query, params) => {
        if (query === 'BEGIN' || query === 'COMMIT') {
          return Promise.resolve(createQueryResult([]));
        }
        
        if (query.includes('INSERT INTO TrackingPlans')) {
          return Promise.resolve(createQueryResult([{ id: 1 }]));
        }
        
        if (query.includes('INSERT INTO Events')) {
          return Promise.resolve(createQueryResult([{ id: 101 }]));
        }
        
        if (query.includes('INSERT INTO Properties')) {
          return Promise.resolve(createQueryResult([{ id: 1001 }]));
        }
        
        if (query.includes('INSERT INTO Event_Properties') || query.includes('INSERT INTO TrackingPlan_Events')) {
          return Promise.resolve(createQueryResult([]));
        }
        
        return Promise.resolve(createQueryResult([]));
      });

      await createTrackingPlan(trackingPlan);

      // Verify transaction was started and committed
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      
      // Verify tracking plan was inserted
      expect(mockClient.query).toHaveBeenCalledWith(
        'INSERT INTO TrackingPlans (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING id',
        ['New Tracking Plan', 'Test description']
      );
      
      // Verify event was inserted
      expect(mockClient.query).toHaveBeenCalledWith(
        'INSERT INTO Events (name, type, description) VALUES ($1, $2, $3) ON CONFLICT (name, type) DO NOTHING RETURNING id',
        ['Test Event', 'track', 'Test event description']
      );
      
      // Verify client was released
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should throw AllreadyExistsError when tracking plan already exists', async () => {
      // Mock getClient to return our mock client
      (db.getClient as jest.Mock).mockResolvedValue(mockClient);

      const trackingPlan: create_tracking_plan = {
        name: 'Existing Plan',
        description: 'Test description',
        events: []
      };

      // Mock client.query to return empty rows for tracking plan insertion
      mockClient.query.mockImplementation((query) => {
        if (query === 'BEGIN') {
          return Promise.resolve(createQueryResult([]));
        }
        
        if (query === 'ROLLBACK') {
          return Promise.resolve(createQueryResult([]));
        }
        
        if (query.includes('INSERT INTO TrackingPlans')) {
          return Promise.resolve(createQueryResult([])); // Empty rows indicates conflict
        }
        
        return Promise.resolve(createQueryResult([]));
      });

      await expect(createTrackingPlan(trackingPlan)).rejects.toThrow(AllreadyExistsError);
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle database errors and rollback transaction', async () => {
      // Mock getClient to return our mock client
      (db.getClient as jest.Mock).mockResolvedValue(mockClient);

      const trackingPlan: create_tracking_plan = {
        name: 'Error Plan',
        description: 'Test description',
        events: []
      };

      // Mock client.query to throw an error
      mockClient.query.mockImplementation((query) => {
        if (query === 'BEGIN') {
          return Promise.resolve(createQueryResult([]));
        }
        
        if (query === 'ROLLBACK') {
          return Promise.resolve(createQueryResult([]));
        }
        
        return Promise.reject(new Error('Database error'));
      });

      await expect(createTrackingPlan(trackingPlan)).rejects.toThrow('Database error');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('getTrackingPlanById', () => {
    it('should return a tracking plan by id', async () => {
      // Mock the db.query function
      (db.query as jest.Mock).mockResolvedValueOnce(createQueryResult([
        { id: 1, name: 'Test Plan', description: 'Test description' }
      ]));

      const result = await getTrackingPlanById(1);

      expect(result).toEqual({ id: 1, name: 'Test Plan', description: 'Test description' });
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM TrackingPlans WHERE id = $1', [1]);
    });

    it('should return undefined when tracking plan does not exist', async () => {
      // Mock the db.query function to return empty rows
      (db.query as jest.Mock).mockResolvedValueOnce(createQueryResult([]));

      const result = await getTrackingPlanById(999);

      expect(result).toBeUndefined();
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM TrackingPlans WHERE id = $1', [999]);
    });

    it('should handle database errors', async () => {
      // Mock the db.query function to throw an error
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(getTrackingPlanById(1)).rejects.toThrow('Database error');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM TrackingPlans WHERE id = $1', [1]);
    });
  });

  describe('updateTrackingPlan', () => {
    const mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };

    it('should handle database errors and rollback transaction', async () => {
      // Mock getClient to return our mock client
      (db.getClient as jest.Mock).mockResolvedValue(mockClient);

      const updatedPlan: create_tracking_plan = {
        name: 'Error Plan',
        description: 'Test description',
        events: []
      };

      // Mock client.query to throw an error
      mockClient.query.mockImplementation((query) => {
        if (query === 'BEGIN') {
          return Promise.resolve(createQueryResult([]));
        }
        
        if (query === 'ROLLBACK') {
          return Promise.resolve(createQueryResult([]));
        }
        
        return Promise.reject(new Error('Database error'));
      });

      await expect(updateTrackingPlan(1, updatedPlan)).rejects.toThrow('Database error');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('deleteTrackingPlans', () => {
    it('should delete a tracking plan by id', async () => {
      // Mock the db.query function
      (db.query as jest.Mock).mockResolvedValueOnce(createQueryResult([
        { id: 1, name: 'Deleted Plan', description: 'Plan to be deleted' }
      ]));

      const result = await deleteTrackingPlans(1);

      expect(result).toEqual({ id: 1, name: 'Deleted Plan', description: 'Plan to be deleted' });
      expect(db.query).toHaveBeenCalledWith('DELETE FROM TrackingPlans WHERE id = $1 RETURNING *', [1]);
    });

    it('should return undefined when tracking plan does not exist', async () => {
      // Mock the db.query function to return empty rows
      (db.query as jest.Mock).mockResolvedValueOnce(createQueryResult([]));

      const result = await deleteTrackingPlans(999);

      expect(result).toBeUndefined();
      expect(db.query).toHaveBeenCalledWith('DELETE FROM TrackingPlans WHERE id = $1 RETURNING *', [999]);
    });

    it('should handle database errors', async () => {
      // Mock the db.query function to throw an error
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(deleteTrackingPlans(1)).rejects.toThrow('Database error');
      expect(db.query).toHaveBeenCalledWith('DELETE FROM TrackingPlans WHERE id = $1 RETURNING *', [1]);
    });
  });
});