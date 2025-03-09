import request from 'supertest';
import * as propertiesController from '../../controllers/properties';
import { app } from '../../app';

// Mock the properties controller
jest.mock('../../controllers/properties');

describe('Properties Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/properties', () => {
    it('should return all properties', async () => {
      const mockProperties = [
        { id: 1, name: 'color', type: 'string', description: 'Product color' },
        { id: 2, name: 'size', type: 'number', description: 'Product size' }
      ];
      
      (propertiesController.getAllProperties as jest.Mock).mockResolvedValue(mockProperties);

      const response = await request(app)
        .get('/api/v1/properties')
        .expect(200);
      expect(response.body).toEqual(mockProperties);
      expect(propertiesController.getAllProperties).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      const errorMessage = 'Database error';
      (propertiesController.getAllProperties as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get('/api/v1/properties')
        .expect(400);
    });
  });

  describe('POST /api/v1/properties', () => {
    const validProperty = {
      name: 'weight',
      type: 'number',
      description: 'Product weight'
    };

    const invalidProperty = {
      name: '',
      type: 'invalid',
      description: 'Invalid property'
    };

    it('should create a new property with valid data', async () => {
      const mockCreatedProperty = { id: 3, ...validProperty };
      (propertiesController.createProperty as jest.Mock).mockResolvedValue(mockCreatedProperty);

      const response = await request(app)
        .post('/api/v1/properties')
        .send(validProperty)
        .expect(200);

      expect(response.body).toEqual(mockCreatedProperty);
      expect(propertiesController.createProperty).toHaveBeenCalledWith(validProperty);
    });

    it('should return validation errors with invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/properties')
        .send(invalidProperty)
        .expect(400);

      expect(propertiesController.createProperty).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/v1/properties/:id', () => {
    const validProperty = {
      name: 'updated',
      type: 'boolean',
      description: 'Updated property'
    };

    it('should update a property with valid data', async () => {
      const propertyId = 1;
      const mockUpdatedProperty = { id: propertyId, ...validProperty };
      (propertiesController.updateProperty as jest.Mock).mockResolvedValue(mockUpdatedProperty);

      const response = await request(app)
        .put(`/api/v1/properties/${propertyId}`)
        .send(validProperty)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedProperty);
      expect(propertiesController.updateProperty).toHaveBeenCalledWith(propertyId, validProperty);
    });

    it('should return validation errors with invalid data', async () => {
      const propertyId = 1;
      const invalidProperty = {
        name: '',
        type: 'invalid',
        description: 'Invalid property'
      };

      const response = await request(app)
        .put(`/api/v1/properties/${propertyId}`)
        .send(invalidProperty)
        .expect(400);

      expect(propertiesController.updateProperty).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/v1/properties/:id', () => {
    it('should delete a property', async () => {
      const propertyId = 1;
      const mockDeletedProperty = { id: propertyId, name: 'deleted', type: 'string', description: 'Deleted property' };
      (propertiesController.deleteProperty as jest.Mock).mockResolvedValue(mockDeletedProperty);

      const response = await request(app)
        .delete(`/api/v1/properties/${propertyId}`)
        .expect(200);
      
      expect(response.body).toEqual(mockDeletedProperty);
      expect(propertiesController.deleteProperty).toHaveBeenCalledWith(propertyId);
    });
  });
});