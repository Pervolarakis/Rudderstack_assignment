import * as propertiesModule from '../properties';
import * as db from '../../db/index';
import { property_create } from '../../types';

// Mock the db module
jest.mock('../../db/index');

describe('Properties Module', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProperties', () => {
    it('should return all properties', async () => {
      // Mock data
      const mockProperties = {
        rows: [
          { 
            id: 1, 
            name: 'product_id', 
            type: 'string', 
            description: 'Unique identifier for the product', 
            validation_rules: JSON.parse('{"pattern": "^[A-Z]{2}\\\\d{6}$"}'),
            create_time: new Date('2023-01-01'),
            update_time: new Date('2023-01-01')
          },
          { 
            id: 2, 
            name: 'price', 
            type: 'number', 
            description: 'Price of the product', 
            validation_rules: JSON.parse('{"min": 0}'),
            create_time: new Date('2023-01-02'),
            update_time: new Date('2023-01-02')
          },
          { 
            id: 3, 
            name: 'is_premium', 
            type: 'boolean', 
            description: 'Whether this is a premium product', 
            validation_rules: null,
            create_time: new Date('2023-01-03'),
            update_time: new Date('2023-01-03')
          }
        ]
      };
      
      // Setup mock
      (db.query as jest.Mock).mockResolvedValueOnce(mockProperties);
      
      // Call function
      const result = await propertiesModule.getAllProperties();
      
      // Assertions
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM properties', null);
      expect(result).toEqual(mockProperties.rows);
      expect(result.length).toBe(3);

      // Verify property structure based on description
      result.forEach(property => {
        expect(property).toHaveProperty('id');
        expect(property).toHaveProperty('name');
        expect(property).toHaveProperty('type');
        expect(property).toHaveProperty('description');
        expect(property).toHaveProperty('create_time');
        expect(property).toHaveProperty('update_time');
        expect(property).toHaveProperty('validation_rules');
        
        // Check that type is one of the allowed values
        expect(['string', 'number', 'boolean']).toContain(property.type);
      });
    });
  });

  describe('createProperty', () => {
    it('should create a new property with string type and return it', async () => {
      // Mock data - using JSON.parse to create validation_rules that match JSON type
      const validationRules = JSON.parse('{"allowedValues": ["USD", "EUR", "GBP", "JPY"]}');
      const newProperty: property_create = {
        name: 'currency',
        type: 'string',
        description: 'Currency code for the transaction',
        validation_rules: validationRules
      };
      
      const mockResult = {
        rows: [{
          id: 4,
          name: 'currency',
          type: 'string',
          description: 'Currency code for the transaction',
          validation_rules: validationRules,
          create_time: new Date(),
          update_time: new Date()
        }]
      };
      
      // Setup mock
      (db.query as jest.Mock).mockResolvedValueOnce(mockResult);
      
      // Call function
      const result = await propertiesModule.createProperty(newProperty);
      
      // Assertions
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO properties (name, type, description, validation_rules) VALUES ($1, $2, $3, $4) RETURNING *',
        [newProperty.name, newProperty.type, newProperty.description, newProperty.validation_rules]
      );
      expect(result).toEqual(mockResult.rows[0]);
      expect(result.type).toBe('string');
    });

    it('should create a new property with number type and return it', async () => {
      // Mock data
      const validationRules = JSON.parse('{"minimum": 1, "maximum": 100}');
      const newProperty: property_create = {
        name: 'quantity',
        type: 'number',
        description: 'Quantity of items purchased',
        validation_rules: validationRules
      };
      
      const mockResult = {
        rows: [{
          id: 5,
          name: 'quantity',
          type: 'number',
          description: 'Quantity of items purchased',
          validation_rules: validationRules,
          create_time: new Date(),
          update_time: new Date()
        }]
      };
      
      // Setup mock
      (db.query as jest.Mock).mockResolvedValueOnce(mockResult);
      
      // Call function
      const result = await propertiesModule.createProperty(newProperty);
      
      // Assertions
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO properties (name, type, description, validation_rules) VALUES ($1, $2, $3, $4) RETURNING *',
        [newProperty.name, newProperty.type, newProperty.description, newProperty.validation_rules]
      );
      expect(result).toEqual(mockResult.rows[0]);
      expect(result.type).toBe('number');
    });

    it('should create a new property with boolean type and return it', async () => {
      // Mock data
      const newProperty: property_create = {
        name: 'is_first_purchase',
        type: 'boolean',
        description: 'Whether this is the customer\'s first purchase'
      };
      
      const mockResult = {
        rows: [{
          id: 6,
          name: 'is_first_purchase',
          type: 'boolean',
          description: 'Whether this is the customer\'s first purchase',
          validation_rules: null,
          create_time: new Date(),
          update_time: new Date()
        }]
      };
      
      // Setup mock
      (db.query as jest.Mock).mockResolvedValueOnce(mockResult);
      
      // Call function
      const result = await propertiesModule.createProperty(newProperty);
      
      // Assertions
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO properties (name, type, description, validation_rules) VALUES ($1, $2, $3, $4) RETURNING *',
        [newProperty.name, newProperty.type, newProperty.description, newProperty.validation_rules]
      );
      expect(result).toEqual(mockResult.rows[0]);
      expect(result.type).toBe('boolean');
    });

    it('should handle name+type uniqueness violation errors', async () => {
      // Mock data for a duplicate property (same name and type)
      const duplicateProperty: property_create = {
        name: 'product_id',
        type: 'string',
        description: 'Duplicate property',
        validation_rules: JSON.parse('{}')
      };
      
      // Simulate a PostgreSQL unique constraint violation
      const uniqueError = new Error('duplicate key value violates unique constraint "properties_name_type_key"');
      (uniqueError as any).code = '23505'; // PostgreSQL unique violation code
      
      // Setup mock to throw unique constraint error
      (db.query as jest.Mock).mockRejectedValueOnce(uniqueError);
      
      // Spy on console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Call function
      const result = await propertiesModule.createProperty(duplicateProperty);
      
      // Assertions
      expect(db.query).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(uniqueError);
      expect(result).toBeUndefined();
      
      // Restore console.log
      consoleSpy.mockRestore();
    });

    it('should handle errors during property creation', async () => {
      // Mock data with an invalid type (not in allowed list)
      const invalidProperty = {
        name: 'timestamp',
        type: 'date', // Invalid type - not in ["string", "number", "boolean"]
        description: 'Event timestamp',
        validation_rules: JSON.parse('{}')
      };
      
      // Setup mock to throw error (would be handled at DB level due to CHECK constraint)
      const error = new Error('check constraint violation');
      (db.query as jest.Mock).mockRejectedValueOnce(error);
      
      // Spy on console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Call function
      const result = await propertiesModule.createProperty(invalidProperty as any);
      
      // Assertions
      expect(db.query).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
      
      // Restore console.log
      consoleSpy.mockRestore();
    });
  });

  describe('getPropertyById', () => {
    it('should return a property by id with complete metadata', async () => {
      // Mock data with create_time and update_time
      const mockCreationDate = new Date('2023-01-15T12:00:00Z');
      const mockUpdateDate = new Date('2023-02-20T14:30:00Z');
      
      const mockProperty = {
        rows: [{
          id: 1,
          name: 'product_id',
          type: 'string',
          description: 'Unique identifier for the product',
          validation_rules: JSON.parse('{"pattern": "^[A-Z]{2}\\\\d{6}$"}'),
          create_time: mockCreationDate,
          update_time: mockUpdateDate
        }]
      };
      
      // Setup mock
      (db.query as jest.Mock).mockResolvedValueOnce(mockProperty);
      
      // Call function
      const result = await propertiesModule.getPropertyById(1);
      
      // Assertions
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM properties WHERE id = $1', [1]);
      expect(result).toEqual(mockProperty.rows[0]);
      
      // Verify metadata fields
      expect(result.create_time).toEqual(mockCreationDate);
      expect(result.update_time).toEqual(mockUpdateDate);
    });

    it('should return undefined for non-existent property id', async () => {
      // Mock data for empty result
      const mockEmptyResult = { rows: [] };
      
      // Setup mock
      (db.query as jest.Mock).mockResolvedValueOnce(mockEmptyResult);
      
      // Call function
      const result = await propertiesModule.getPropertyById(999);
      
      // Assertions
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM properties WHERE id = $1', [999]);
      expect(result).toBeUndefined();
    });
  });

  describe('updateProperty', () => {
    it('should update a property description and validation rules', async () => {
      // Mock data
      const propertyId = 2;
      const validationRules = JSON.parse('{"minimum": 0.01, "maximum": 9999.99}');
      const updatedProperty: property_create = {
        name: 'price', // Same name
        type: 'number', // Same type
        description: 'Updated price description',
        validation_rules: validationRules // Updated validation rules
      };
      
      const mockResult = {
        rows: [{
          id: propertyId,
          name: 'price',
          type: 'number',
          description: 'Updated price description',
          validation_rules: validationRules,
          create_time: new Date('2023-01-02'),
          update_time: new Date('2023-03-15') // Update time would change
        }]
      };
      
      // Setup mock
      (db.query as jest.Mock).mockResolvedValueOnce(mockResult);
      
      // Call function
      const result = await propertiesModule.updateProperty(propertyId, updatedProperty);
      
      // Assertions
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE properties SET name = $1, type = $2, description = $3, validation_rules = $4 WHERE id = $5 RETURNING *',
        [updatedProperty.name, updatedProperty.type, updatedProperty.description, updatedProperty.validation_rules, propertyId]
      );
      expect(result).toEqual(mockResult.rows[0]);
      
      // Verify that create_time and update_time are present
      expect(result).toHaveProperty('create_time');
      expect(result).toHaveProperty('update_time');
    });

    it('should handle updating to a property with an existing name+type combination', async () => {
      // Mock data for an update that would violate uniqueness
      const propertyId = 3;
      const conflictingUpdate: property_create = {
        name: 'product_id', // Already exists
        type: 'string',     // Already exists with this name
        description: 'Some description',
        validation_rules: JSON.parse('{}')
      };
      
      // Simulate a PostgreSQL unique constraint violation
      const uniqueError = new Error('duplicate key value violates unique constraint "properties_name_type_key"');
      (uniqueError as any).code = '23505'; // PostgreSQL unique violation code
      
      // Setup mock to throw error
      (db.query as jest.Mock).mockRejectedValueOnce(uniqueError);
      
      // Since our current implementation doesn't handle this error specifically
      // (it doesn't have a try/catch), we expect the error to be thrown
      await expect(propertiesModule.updateProperty(propertyId, conflictingUpdate)).rejects.toThrow();
      
      // Verify the query was called with the right parameters
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE properties SET name = $1, type = $2, description = $3, validation_rules = $4 WHERE id = $5 RETURNING *',
        [conflictingUpdate.name, conflictingUpdate.type, conflictingUpdate.description, conflictingUpdate.validation_rules, propertyId]
      );
    });
  });

  describe('deleteProperty', () => {
    it('should delete a property and return the deleted property data', async () => {
      // Mock data
      const propertyId = 3;
      const mockResult = {
        rows: [{
          id: propertyId,
          name: 'is_premium',
          type: 'boolean',
          description: 'Whether this is a premium product',
          validation_rules: null,
          create_time: new Date('2023-01-03'),
          update_time: new Date('2023-01-03')
        }]
      };
      
      // Setup mock
      (db.query as jest.Mock).mockResolvedValueOnce(mockResult);
      
      // Call function
      const result = await propertiesModule.deleteProperty(propertyId);
      
      // Assertions
      expect(db.query).toHaveBeenCalledWith('DELETE FROM properties WHERE id = $1 RETURNING *', [propertyId]);
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should return undefined when deleting non-existent property', async () => {
      // Mock data for empty result
      const mockEmptyResult = { rows: [] };
      
      // Setup mock
      (db.query as jest.Mock).mockResolvedValueOnce(mockEmptyResult);
      
      // Call function
      const result = await propertiesModule.deleteProperty(999);
      
      // Assertions
      expect(db.query).toHaveBeenCalledWith('DELETE FROM properties WHERE id = $1 RETURNING *', [999]);
      expect(result).toBeUndefined();
    });
  });
});