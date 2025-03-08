import { body } from "express-validator";

export const eventSchema = [
    body('name')
        .exists({checkFalsy: true})
        .withMessage("name cant be empty"),
    body('type')
        .exists({checkFalsy: true})
        .withMessage("type cant be empty")
        .isIn(['track', 'identify', 'alias', 'screen', 'page'])
        .withMessage("type must be one of track, identify, alias, screen, page"),
    body('description')
        .exists({checkFalsy: true})
        .withMessage("type cant be empty"),    
];