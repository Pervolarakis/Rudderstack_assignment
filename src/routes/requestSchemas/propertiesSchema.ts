import { body } from "express-validator";

export const propertiesSchema = [
    body('name')
        .exists({checkFalsy: true})
        .withMessage("name cant be empty"),
    body('type')
        .exists({checkFalsy: true})
        .withMessage("type cant be empty")
        .isIn(['string', 'number', 'boolean'])
        .withMessage("type must be one of string, number, boolean"),
    body('description')
        .exists({checkFalsy: true})
        .withMessage("type cant be empty"),
    // body('validation_rules')
    //     .exists({checkFalsy: false})
    //     .isJSON()
    //     .withMessage("validation_rules must be a valid JSON object"),    
];