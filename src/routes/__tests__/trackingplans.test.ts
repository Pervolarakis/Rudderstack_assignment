import request from 'supertest';
import * as trackingPlansController from '../../controllers/trackingPlans';
import { app } from '../../app';

// Mock the controller functions
jest.mock('../../controllers/trackingPlans');

describe('Tracking Plans Router', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/v1/tracking_plans', () => {
    it('should return all tracking plans', async () => {
      // Mock data
      const mockTrackingPlans = [
        { id: 1, name: 'Plan 1', description: 'Description 1', events: [] },
        { id: 2, name: 'Plan 2', description: 'Description 2', events: [] }
      ];
      
      // Setup mock implementation
      (trackingPlansController.getAllTrackingPlans as jest.Mock).mockResolvedValue(mockTrackingPlans);
      
      // Execute request
      const response = await request(app)
        .get('/api/v1/tracking_plans')
        .expect(200);
      
      // Assertions
      expect(response.body).toEqual(mockTrackingPlans);
      expect(trackingPlansController.getAllTrackingPlans).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from controller', async () => {
      // Setup mock implementation to throw an error
      (trackingPlansController.getAllTrackingPlans as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Execute request
      const response = await request(app)
        .get('/api/v1/tracking_plans')
        .expect(400);
      
    });
  });

  describe('POST /api/v1/tracking_plans', () => {
    const validTrackingPlan = {
      name: 'New Plan',
      description: 'New Plan Description',
      events: [
        {
          name: 'Event 1',
          type: 'track',
          description: 'Event Description',
          properties: [
            {
              name: 'prop1',
              type: 'string',
              description: 'Property Description',
              required: true
            }
          ]
        }
      ]
    };

    it('should create a new tracking plan with valid data', async () => {
      // Mock response data
      const mockCreatedPlan = { id: 1, ...validTrackingPlan };
      
      // Setup mock implementation
      (trackingPlansController.createTrackingPlan as jest.Mock).mockResolvedValue(mockCreatedPlan);
      
      // Execute request
      const response = await request(app)
        .post('/api/v1/tracking_plans')
        .send(validTrackingPlan)
        .expect(200);
      
      // Assertions
      expect(response.body).toEqual(mockCreatedPlan);
      expect(trackingPlansController.createTrackingPlan).toHaveBeenCalledWith(validTrackingPlan);
    });

    it('should return validation errors for invalid plan data', async () => {
      // Invalid data missing required fields
      const invalidPlan = {
        name: 'Invalid Plan',
        // Missing description
        events: [
          {
            name: 'Event 1',
            // Missing type
            description: 'Event Description',
            properties: []
          }
        ]
      };
      
      // Execute request
      const response = await request(app)
        .post('/api/v1/tracking_plans')
        .send(invalidPlan)
        .expect(400);
      
      // Assertions
      expect(trackingPlansController.createTrackingPlan).not.toHaveBeenCalled();
    });

    it('should validate event type', async () => {
      // Invalid event type
      const invalidEventType = {
        ...validTrackingPlan,
        events: [
          {
            ...validTrackingPlan.events[0],
            type: 'invalid_type' // Not one of the allowed types
          }
        ]
      };
      
      // Execute request
      const response = await request(app)
        .post('/api/v1/tracking_plans')
        .send(invalidEventType)
        .expect(400);
      
      // Assertions
      expect(trackingPlansController.createTrackingPlan).not.toHaveBeenCalled();
    });

    it('should validate property type', async () => {
      // Invalid property type
      const invalidPropertyType = {
        ...validTrackingPlan,
        events: [
          {
            ...validTrackingPlan.events[0],
            properties: [
              {
                ...validTrackingPlan.events[0].properties[0],
                type: 'invalid_type' // Not one of string, number, boolean
              }
            ]
          }
        ]
      };
      
      // Execute request
      const response = await request(app)
        .post('/api/v1/tracking_plans')
        .send(invalidPropertyType)
        .expect(400);
      
      // Assertions
      expect(trackingPlansController.createTrackingPlan).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/v1/tracking_plans/:id', () => {
    const validUpdatePlan = {
      name: 'Updated Plan',
      description: 'Updated Plan Description',
      events: [
        {
          name: 'Updated Event',
          type: 'page',
          description: 'Updated Event Description',
          properties: [
            {
              name: 'updatedProp',
              type: 'boolean',
              description: 'Updated Property Description',
              required: false
            }
          ]
        }
      ]
    };

    it('should update an existing tracking plan', async () => {
      // Mock response
      const mockUpdatedPlan = { id: 1, ...validUpdatePlan };
      
      // Setup mock implementation
      (trackingPlansController.updateTrackingPlan as jest.Mock).mockResolvedValue(mockUpdatedPlan);
      
      // Execute request
      const response = await request(app)
        .put('/api/v1/tracking_plans/1')
        .send(validUpdatePlan)
        .expect(200);
      
      // Assertions
      expect(response.body).toEqual(mockUpdatedPlan);
      expect(trackingPlansController.updateTrackingPlan).toHaveBeenCalledWith(1, validUpdatePlan);
    });

    it('should return validation errors for invalid update data', async () => {
      // Invalid data
      const invalidUpdate = {
        name: 'Invalid Update',
        // Missing description
        events: []
      };
      
      // Execute request
      const response = await request(app)
        .put('/api/v1/tracking_plans/1')
        .send(invalidUpdate)
        .expect(400);
      
      // Assertions
      expect(trackingPlansController.updateTrackingPlan).not.toHaveBeenCalled();
    });

  });

  describe('DELETE /api/v1/tracking_plans/:id', () => {
    it('should delete a tracking plan', async () => {
      // Mock response
      const mockDeletedPlan = { id: 1, name: 'Deleted Plan' };
      
      // Setup mock implementation
      (trackingPlansController.deleteTrackingPlans as jest.Mock).mockResolvedValue(mockDeletedPlan);
      
      // Execute request
      const response = await request(app)
        .delete('/api/v1/tracking_plans/1')
        .expect(200);
      
      // Assertions
      expect(response.body).toEqual(mockDeletedPlan);
      expect(trackingPlansController.deleteTrackingPlans).toHaveBeenCalledWith(1);
    });

    it('should handle errors from controller during deletion', async () => {
      // Setup mock implementation to throw an error
      (trackingPlansController.deleteTrackingPlans as jest.Mock).mockRejectedValue(new Error('Delete error'));
      
      // Execute request
      const response = await request(app)
        .delete('/api/v1/tracking_plans/1')
        .expect(400);
    });

  });
});