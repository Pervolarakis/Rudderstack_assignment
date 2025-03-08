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