import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";
import * as trackingPlansService from "../services/trackingPlans";
import { create_tracking_plan } from "../types";

const getAllTrackingPlans = async () => {
    return await trackingPlansService.getAllTrackingPlans();
}

const createTrackingPlan = async (trackingPlan: create_tracking_plan) => {
    return await trackingPlansService.createTrackingPlan(trackingPlan);
}

// const updateTrackingPlan = async (id: number, property: create_tracking_plan) => {
//     const findProperty = await trackingPlansService.getTrackingPlansById(id);
//     if (!findProperty) {
//         throw new ResourceNotFoundError('property');
//     }
//     return await trackingPlansService.updateTrackingPlan(id, property);
// }

const deleteTrackingPlans = async (id: number) => {
    const findTrackingPlan = await trackingPlansService.getTrackingPlansById(id);
    if (!findTrackingPlan) {
        throw new ResourceNotFoundError('property');
    }
    return await trackingPlansService.deleteTrackingPlans(id);
}

export {getAllTrackingPlans, createTrackingPlan, deleteTrackingPlans};