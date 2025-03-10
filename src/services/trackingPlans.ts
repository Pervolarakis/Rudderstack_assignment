import * as db from '../db/index'
import { AllreadyExistsError } from '../errors/AlreadyExistsError';
import { create_tracking_plan, event_with_properties, get_tracking_plan, tracking_property } from '../types';

const getAllTrackingPlans = async () => {
    const trackingPlansResult = await db.query('SELECT id, name, description FROM TrackingPlans', null);
    const trackingPlans = trackingPlansResult.rows;

    const result = [];

    for (const trackingPlan of trackingPlans) {
      const planData: get_tracking_plan = {
        id: trackingPlan.id,
        name: trackingPlan.name,
        description: trackingPlan.description,
        events: [],
      };

      // Step 2: Get events for the tracking plan
      const eventsResult = await db.query(
        `SELECT E.id, E.name, E.type, E.description, TPE.additional_properties_allowed
         FROM TrackingPlan_Events TPE
         JOIN Events E ON TPE.event_id = E.id
         WHERE TPE.tracking_plan_id = $1`,
        [trackingPlan.id]
      );
      const events = eventsResult.rows;

      for (const event of events) {
        const eventData: event_with_properties = {
          name: event.name,
          description: event.description,
          type: event.type,
          properties: [],
          additionalProperties: event.additional_properties_allowed,
        };

        // Step 3: Get properties for the event
        const propertiesResult = await db.query(
          `SELECT P.id, P.name, P.type, P.description, EP.required
           FROM Event_Properties EP
           JOIN Properties P ON EP.property_id = P.id
           WHERE EP.event_id = $1`,
          [event.id]
        );
        const properties: tracking_property[] = propertiesResult.rows;
        
        for (const property of properties) {
          eventData.properties.push({
            name: property.name,
            type: property.type,
            required: property.required,
            description: property.description,
          });
        }
        planData.events.push(eventData);
      }

      result.push(planData);
    }

    return result;
}

const createTrackingPlan = async (trackingPlan: create_tracking_plan) => {
  const client = await db.getClient();
  try {
      await client.query('BEGIN');
      
      const trackingPlanResult = await client.query(
          'INSERT INTO TrackingPlans (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING id',
          [trackingPlan.name, trackingPlan.description]
        );
      
      let trackingPlanId;
      if (trackingPlanResult.rows.length > 0) {
          trackingPlanId = trackingPlanResult.rows[0].id;
      } else {
          throw new AllreadyExistsError('Tracking plan');
      }

      for (const event of trackingPlan.events) {
          const eventResult = await client.query(
              'INSERT INTO Events (name, type, description) VALUES ($1, $2, $3) ON CONFLICT (name, type) DO NOTHING RETURNING id',
              [event.name, event.type, event.description]
          );
      
          // Get the event ID, whether it was inserted or already existed
          let eventId;
          if (eventResult.rows.length > 0) {
              eventId = eventResult.rows[0].id;
          } else {
              const existingEventResult = await client.query(
                  'SELECT id FROM Events WHERE name = $1 AND type = $2',
                  [event.name, event.type]
              );
              eventId = existingEventResult.rows[0].id;
          }

          
          for (const property of event.properties) {
              const propertyResult = await client.query(
                'INSERT INTO Properties (name, type, description, validation_rules) VALUES ($1, $2, $3, $4) ON CONFLICT (name, type) DO NOTHING RETURNING id',
                [property.name, property.type, property.description, property.validation_rules] // Assuming no validation rules for simplicity
              );
      
              // Get the property ID, whether it was inserted or already existed
              let propertyId;
              if (propertyResult.rows.length > 0) {
                propertyId = propertyResult.rows[0].id;
              } else {
                const existingPropertyResult = await client.query(
                  'SELECT id FROM Properties WHERE name = $1 AND type = $2',
                  [property.name, property.type]
                );
                propertyId = existingPropertyResult.rows[0].id;
              }
      
              await client.query(
                  'INSERT INTO Event_Properties (event_id, property_id, required) VALUES ($1, $2, $3) ON CONFLICT (event_id, property_id) DO NOTHING',
                  [eventId, propertyId, property.required]
              );
          }
          await client.query(
              'INSERT INTO TrackingPlan_Events (tracking_plan_id, event_id, additional_properties_allowed) VALUES ($1, $2, $3) ON CONFLICT (tracking_plan_id, event_id) DO NOTHING',
              [trackingPlanId, eventId, event.additionalProperties === 'true']
            );
      }
      await client.query('COMMIT');
      return {id: trackingPlanId};
  } catch (error) {
      await client.query('ROLLBACK');
      throw error;
  }
  finally{
      await client.release();
  }
}

const getTrackingPlanById = async (id: number) => {
  const trackingPlan = await db.query(`SELECT * FROM TrackingPlans WHERE id = $1`, [id]);
  return trackingPlan.rows[0];
}

const updateTrackingPlan = async (id: number, trackingPlan: create_tracking_plan) => {
  const client = await db.getClient();
  try {
      await client.query('BEGIN');
      let trackingPlanId = id;
      const trackingplan = await db.query(`UPDATE TrackingPlans SET name = $1, description = $2 WHERE id = $3 RETURNING *`, [trackingPlan.name, trackingPlan.description, id]);
      const trackingPlanEvents = await db.query(`DELETE FROM TrackingPlan_Events WHERE tracking_plan_id = $1 RETURNING *`, [trackingPlanId]);
      
      for (const event of trackingPlan.events) {
          const eventResult = await client.query(
              'INSERT INTO Events (name, type, description) VALUES ($1, $2, $3) ON CONFLICT (name, type) DO NOTHING RETURNING id',
              [event.name, event.type, event.description]
          );
      
          // Get the event ID, whether it was inserted or already existed
          let eventId;
          if (eventResult.rows.length > 0) {
              eventId = eventResult.rows[0].id;
          } else {
              const existingEventResult = await client.query(
                  'SELECT id FROM Events WHERE name = $1 AND type = $2',
                  [event.name, event.type]
              );
              eventId = existingEventResult.rows[0].id;
          }

          
          for (const property of event.properties) {
              const propertyResult = await client.query(
                'INSERT INTO Properties (name, type, description, validation_rules) VALUES ($1, $2, $3, $4) ON CONFLICT (name, type) DO NOTHING RETURNING id',
                [property.name, property.type, property.description, property.validation_rules] // Assuming no validation rules for simplicity
              );
      
              // Get the property ID, whether it was inserted or already existed
              let propertyId;
              if (propertyResult.rows.length > 0) {
                propertyId = propertyResult.rows[0].id;
              } else {
                const existingPropertyResult = await client.query(
                  'SELECT id FROM Properties WHERE name = $1 AND type = $2',
                  [property.name, property.type]
                );
                propertyId = existingPropertyResult.rows[0].id;
              }
      
              await client.query(
                  'INSERT INTO Event_Properties (event_id, property_id, required) VALUES ($1, $2, $3) ON CONFLICT (event_id, property_id) DO NOTHING',
                  [eventId, propertyId, property.required]
              );
          }
          await client.query(
              'INSERT INTO TrackingPlan_Events (tracking_plan_id, event_id, additional_properties_allowed) VALUES ($1, $2, $3) ON CONFLICT (tracking_plan_id, event_id) DO NOTHING',
              [trackingPlanId, eventId, event.additionalProperties === 'true']
            );
      }
      await client.query('COMMIT');
      return trackingplan.rows[0];
  } catch (error) {
      await client.query('ROLLBACK');
      throw error;
  }
  finally{
      await client.release();
  }
}

const deleteTrackingPlans = async (id: number) => {
    const trackingPlans = await db.query(`DELETE FROM TrackingPlans WHERE id = $1 RETURNING *`, [id]);
    return trackingPlans.rows[0];
}

export {getAllTrackingPlans, createTrackingPlan, getTrackingPlanById, deleteTrackingPlans, updateTrackingPlan};