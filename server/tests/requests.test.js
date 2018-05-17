import chai from 'chai';
import request from 'supertest';
import app from '../app';

const { expect } = chai;

describe ('GET /api/v1/users/requests', () => {
  it('should get all requests', async () => {
    const res = await request(app)
    .get('/api/v1/users/requests')
    .set('Accept', 'application/json')
    .expect(200)

    expect(res.body.status).to.equal('ok');
    expect(res.body.code).to.equal(200)
    expect(res.body).to.have.property('results');
    expect(res.body.results).to.have.property('requests');
    expect(res.body.results.requests[0]).to.be.an('object');
  })
})