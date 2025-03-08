import { NextFunction, Request, Response, Router } from "express";
import * as eventsController from "../controllers/events";
import { asyncHandler } from "../middlewares/asyncHandler";
import { eventSchema } from "./requestSchemas/eventSchema";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";

const router = Router();

router.get("/", asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const events = await eventsController.getAllEvents();
    res.json(events);
}));

router.post("/", eventSchema, validateRequestSchema, asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    const event = await eventsController.createEvent(req.body);
    res.json(event);
}));

export { router as eventsRouter };