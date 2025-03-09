import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";
import * as trackingPlansService from "../services/trackingPlans";
import { create_tracking_plan } from "../types";

const getAllTrackingPlans = async () => {
    return await trackingPlansService.getAllTrackingPlans();
}

const createTrackingPlan = async (trackingPlan: create_tracking_plan) => {
    return await trackingPlansService.createTrackingPlan(trackingPlan);
}

const updateTrackingPlan = async (id: number, trackingPlan: create_tracking_plan) => {
    const findTrackingPlan = await trackingPlansService.getTrackingPlanById(id);
    if (!findTrackingPlan) {
        throw new ResourceNotFoundError('Tracking plan');
    }
    return await trackingPlansService.updateTrackingPlan(id, trackingPlan);
}

const deleteTrackingPlans = async (id: number) => {
    const findTrackingPlan = await trackingPlansService.getTrackingPlanById(id);
    if (!findTrackingPlan) {
        throw new ResourceNotFoundError('Tracking plan');
    }
    return await trackingPlansService.deleteTrackingPlans(id);
}

export {getAllTrackingPlans, createTrackingPlan, updateTrackingPlan, deleteTrackingPlans};