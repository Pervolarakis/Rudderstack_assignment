import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";
import * as propertiesService from "../services/properties";
import { property_create } from "../types";

const getAllProperties = async () => {
    return await propertiesService.getAllProperties();
}

const createProperty = async (property: property_create) => {
    return await propertiesService.createProperty(property);
}

const updateProperty = async (id: number, property: property_create) => {
    const findProperty = await propertiesService.getPropertyById(id);
    if (!findProperty) {
        throw new ResourceNotFoundError('property');
    }
    return await propertiesService.updateProperty(id, property);
}

const deleteProperty = async (id: number) => {
    const findProperty = await propertiesService.getPropertyById(id);
    if (!findProperty) {
        throw new ResourceNotFoundError('property');
    }
    return await propertiesService.deleteProperty(id);
}

export {getAllProperties, createProperty, updateProperty, deleteProperty};