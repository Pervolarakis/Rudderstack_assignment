import { NextFunction, Request, Response, Router } from "express";
import * as eventsController from "../controllers/events";
import { asyncHandler } from "../middlewares/asyncHandler";
import { eventSchema } from "./requestSchemas/eventSchema";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";

const router = Router();

router.get("/", asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const events = await eventsController.getAllEvents();
    return res.json(events);
}));

router.post("/", eventSchema, validateRequestSchema, asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const event = await eventsController.createEvent(req.body);
    return res.json(event);
}));

router.put("/:id", eventSchema, validateRequestSchema, asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const event = await eventsController.updateEvent(parseInt(req.params.id), req.body);
    return res.json(event);
}));

export { router as eventsRouter };