export interface event {
    id: number,
    name: string,
    type: String,
    description: string,
    create_time: Date,
    update_time: Date
}

export interface event_create {
    name: string,
    type: String,
    description: string
}

export interface property {
    id: number,
    name: string,
    type: String,
    description: string,
    create_time: Date,
    validation_rules: JSON,
    update_time: Date
}

export interface property_create {
    name: string,
    type: String,
    description: string
    validation_rules?: JSON,
}

export interface tracking_property {
    name: string,
    type: String,
    required: boolean,
    description: string,
    validation_rules?: JSON,
}

export interface event_with_properties {
    name: string,
    description: string,
    type: string,
    properties: Array<tracking_property>,
    additionalProperties: string
}

export interface create_tracking_plan {
    name: string,
    description: string,
    events: Array<event_with_properties>,
}

export interface get_tracking_plan {
    id: number,
    name: string,
    description: string,
    events: Array<event_with_properties>,
}