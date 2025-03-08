import { NextFunction, Request, Response, Router } from "express";
import * as propertiesController from "../controllers/properties";
import { asyncHandler } from "../middlewares/asyncHandler";
import { propertiesSchema } from "./requestSchemas/propertiesSchema";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";

const router = Router();

router.get("/", asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const properties = await propertiesController.getAllProperties();
    return res.json(properties);
}));

router.post("/", propertiesSchema, validateRequestSchema, asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const property = await propertiesController.createProperty(req.body);
    return res.json(property);
}));

router.put("/:id", propertiesSchema, validateRequestSchema, asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const property = await propertiesController.updateProperty(parseInt(req.params.id), req.body);
    return res.json(property);
}));

router.delete("/:id", asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const property = await propertiesController.deleteProperty(parseInt(req.params.id));
    return res.json(property);
}));

export { router as propertiesRouter };