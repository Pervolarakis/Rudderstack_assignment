import request from "supertest";
import {app} from '../../app';

it('can fetch a list of events', async () => {
    await request(app)
        .get('/api/v1/events')
        .expect(200);
})

it('can create an event', async () => {
    await request(app)
        .post('/api/v1/events')
        .send({
            "name": "button-click-event",
            "type": "track",
            "description": "button-has-been-clicked"
        })
        .expect(200);
    //fails if property is missing
    await request(app)
        .post('/api/v1/events')
        .send({
            "type": "track",
            "description": "button-has-been-clicked"
        })
        .expect(400);
    await request(app)
        .post('/api/v1/events')
        .send({
            "name": "button-click-event",
            "description": "button-has-been-clicked"
        })
        .expect(400);
    await request(app)
        .post('/api/v1/events')
        .send({
            "name": "button-click-event",
            "type": "track",
        })
        .expect(400);
        await request(app)
        .post('/api/v1/events')
        .send({
            "name": "button-click-event",
            "type": "aaaa",
            "description": "button-has-been-clicked"
        })
        .expect(400);
})