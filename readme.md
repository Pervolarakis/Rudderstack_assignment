# Data Catalog API Service

## Overview

The Data Catalog API Service is a simplified implementation of RudderStack's Data Catalog feature. It provides a centralized repository for tracking customer data events, their properties, and validation rules through tracking plans, enabling effective data management and governance across an organization's data collection infrastructure.

## Core Concepts

### Events

Events represent user actions or system occurrences that are tracked (e.g., "Button Click", "Page View", "Purchase Completed"). Each event:

- Has name, type, and description
- Contains metadata (create_time, update_time)
- Has associated properties describing the event in detail
- Must have a unique combination of name and type
- Has a type limited to: "track", "identify", "alias", "screen", "page"

### Properties

Properties are attributes providing context to events. For example, a "Purchase Completed" event might have properties like "product_id", "price", and "currency". Properties:

- Have a name, type (string, number, boolean), and description
- Contain metadata (create_time, update_time)
- May have validation rules (optional)
- Must have a unique combination of name and type

### Tracking Plans

A TrackingPlan is a collection of events and their expected properties, serving as a contract for data collection. TrackingPlans:

- Group related events together
- Maintain relationships between events and their properties
- Have a unique name
- Specify whether properties are required for each event
- Define whether undefined properties are allowed via the `additionalProperties` flag

## Technical Stack

- **Backend**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Pervolarakis/Rudderstack_assignment.git
   cd Rudderstack_assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the PostgreSQL database:
   ```bash
   docker-compose up
   ```

4. Build and start the application:
   ```bash
   npm run build
   npm start
   ```
   
   Or using Docker:
   ```bash
   docker-compose up
   ```

## API Endpoints

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /events  | Retrieve all events |
| POST   | /events  | Create a new event |
| PUT    | /events/:id | Update an existing event |
| DELETE | /events/:id | Delete an event |

#### Example Event Payload:
```json
{
   "name": "Product Clicked",
   "type": "track",
   "description": "User clicked on the product summary"
}
```

### Properties

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /properties | Retrieve all properties |
| POST   | /properties | Create a new property |
| PUT    | /properties/:id | Update an existing property |
| DELETE | /properties/:id | Delete a property |

#### Example Property Payload:
```json
{
   "name": "price",
   "type": "number",
   "description": "Price of the product"
}
```

### Tracking Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /tracking-plans | Retrieve all tracking plans |
| POST   | /tracking-plans | Create a new tracking plan |
| PUT    | /tracking-plans/:id | Update an existing tracking plan |
| DELETE | /tracking-plans/:id | Delete a tracking plan |

#### Example Tracking Plan Payload:
```json
{
  "name": "Purchase Flow",
  "description": "Events related to the purchase funnel",
  "events": [
    {
      "name": "Product Viewed",
      "type": "track",
      "description": "User viewed a product detail page",
      "properties": [
        {
          "name": "product_id",
          "type": "string",
          "required": true,
          "description": "Unique identifier for the product"
        },
        {
          "name": "price",
          "type": "number",
          "required": true,
          "description": "Product price"
        }
      ],
      "additionalProperties": "true"
    }
  ]
}
```

## Database Schema

The application uses a PostgreSQL database with the following tables:

### Events
- `id`: Serial primary key
- `name`: Event name (VARCHAR)
- `type`: Event type (VARCHAR) - One of: 'track', 'identify', 'alias', 'screen', 'page'
- `description`: Event description (TEXT)
- `create_time`: Creation timestamp
- `update_time`: Last update timestamp
- Unique constraint on (name, type)

### Properties
- `id`: Serial primary key
- `name`: Property name (VARCHAR)
- `type`: Property type (VARCHAR) - One of: 'string', 'number', 'boolean'
- `description`: Property description (TEXT)
- `create_time`: Creation timestamp
- `update_time`: Last update timestamp
- `validation_rules`: JSON field for validation rules (optional)
- Unique constraint on (name, type)

### TrackingPlans
- `id`: Serial primary key
- `name`: Tracking plan name (VARCHAR, unique)
- `description`: Tracking plan description (TEXT)
- `create_time`: Creation timestamp
- `update_time`: Last update timestamp

### Event_Properties (Bridge Table)
- `event_id`: Foreign key to Events
- `property_id`: Foreign key to Properties
- `required`: Boolean indicating if property is required for the event
- Primary key is (event_id, property_id)

### TrackingPlan_Events (Bridge Table)
- `tracking_plan_id`: Foreign key to TrackingPlans
- `event_id`: Foreign key to Events
- `additional_properties_allowed`: Boolean indicating if undefined properties are allowed
- Primary key is (tracking_plan_id, event_id)

## Key Features

- **Automatic Creation**: When creating a tracking plan, if referenced events or properties don't exist, they're automatically created
- **Entity Reuse**: Existing events and properties are reused across tracking plans
- **Validation**: Ensures data integrity and enforces business rules
- **RESTful API**: Follows REST principles for all CRUD operations
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Development

### Project Structure

```
data-catalog-api/
├── src/
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   │   ├── requestSchemas/  # Validation schemas
│   ├── services/         # Business logic
│   ├── db/               # DB setup
│   ├── app.ts            # Express app setup
│   ├── index.ts         # Server entry point
│   ├── types.ts         # Type declerations for typescript
│   └── errors/           # Error handling
├── test/                # Test setup files
├── docker-compose.yml    # Docker compose config
├── Dockerfile            # Docker build instructions
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

### Running Tests

```bash
npm test
```