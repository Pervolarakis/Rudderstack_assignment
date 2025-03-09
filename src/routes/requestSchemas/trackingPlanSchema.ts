import { body } from "express-validator";
export const trackingPlanSchema = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage("tracking plan name can't be empty"),
  
  body('description')
    .exists({ checkFalsy: true })
    .withMessage("tracking plan description can't be empty"),
  
  body('events')
    .exists()
    .withMessage("events array is required")
    .isArray()
    .withMessage("events must be an array"),
  
  body('events.*.name')
    .exists({ checkFalsy: true })
    .withMessage("event name can't be empty"),
  
  body('events.*.type')
    .exists({ checkFalsy: true })
    .withMessage("event type can't be empty")
    .isIn(['track', 'identify', 'alias', 'screen', 'page'])
    .withMessage("event type must be one of track, identify, alias, screen, page"),
  
  body('events.*.description')
    .exists({ checkFalsy: true })
    .withMessage("event description can't be empty"),
  
  body('events.*.properties')
    .exists()
    .withMessage("properties array is required")
    .isArray()
    .withMessage("properties must be an array"),
  
  body('events.*.additionalProperties')
    .optional()
    .isIn(['true', 'false'])
    .withMessage("additionalProperties must be 'true' or 'false'"),
  
  body('events.*.properties.*.name')
    .exists({ checkFalsy: true })
    .withMessage("property name can't be empty"),
  
  body('events.*.properties.*.type')
    .exists({ checkFalsy: true })
    .withMessage("property type can't be empty")
    .isIn(['string', 'number', 'boolean'])
    .withMessage("property type must be one of string, number, boolean"),
  
  body('events.*.properties.*.description')
    .exists({ checkFalsy: true })
    .withMessage("property description can't be empty"),
  
  body('events.*.properties.*.required')
    .exists()
    .isBoolean()
    .withMessage("required must be a boolean")
];