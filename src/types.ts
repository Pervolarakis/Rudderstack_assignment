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
