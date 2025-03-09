import { NextFunction, Request, Response, Router } from "express";
import * as trackingPlansController from "../controllers/trackingPlans";
import { asyncHandler } from "../middlewares/asyncHandler";
import { propertiesSchema } from "./requestSchemas/propertiesSchema";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";

const router = Router();

router.get("/", asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const properties = await trackingPlansController.getAllTrackingPlans();
    return res.json(properties);
}));

router.post("/", asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const trackingPlan = await trackingPlansController.createTrackingPlan(req.body);
    return res.json(trackingPlan);
}));

// router.put("/:id", propertiesSchema, validateRequestSchema, asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
//     const property = await trackingPlansController.updateProperty(parseInt(req.params.id), req.body);
//     return res.json(property);
// }));

router.delete("/:id", asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const trackingPlan = await trackingPlansController.deleteTrackingPlans(parseInt(req.params.id));
    return res.json(trackingPlan);
}));

export { router as trackingPlansRouter };