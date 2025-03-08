import * as db from '../db/index'
import { property_create } from '../types';

const getAllProperties = async () => {
    const properties = await db.query(`SELECT * FROM properties`, null);
    return properties.rows;
}

const createProperty = async (property: property_create) => {
    try {
        const properties = await db.query(`INSERT INTO properties (name, type, description, validation_rules) VALUES ($1, $2, $3, $4)`, [property.name, property.type, property.description, property.validation_rules]);
        return properties.rows;
    } catch (error) {
        console.log(error)
    }
}

const getPropertyById = async (id: number) => {
    const property = await db.query(`SELECT * FROM properties WHERE id = $1`, [id]);
    return property.rows[0];
}

const updateProperty = async (id: number, property: property_create) => {
    const properties = await db.query(`UPDATE properties SET name = $1, type = $2, description = $3, validation_rules = $4 WHERE id = $5`, [property.name, property.type, property.description, property.validation_rules, id]);
    return properties.rows[0];
}

const deleteProperty = async (id: number) => {
    const properties = await db.query(`DELETE FROM properties WHERE id = $1`, [id]);
    return properties.rows[0];
}

export {getAllProperties, createProperty, getPropertyById, updateProperty, deleteProperty};