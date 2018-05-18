import chai from 'chai';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true */
/*  eslint no-undef: "error"  */

const { expect } = chai;
describe('GET /api/v1/users/requests', () => {
  it('should get all requests', async () => {
    const res = await request(app)
      .get('/api/v1/users/requests')
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.status).to.equal('success');
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('requests');
    expect(res.body.data.requests).to.be.an('array');
    expect(res.body.data.requests[0]).to.be.an('object');
  });
});
describe('GET /api/v1/users/requests/:requestId', () => {
  it('should return 404 if request Id not found', async () => {
    const requestId = 342;
    const res = await request(app)
      .get(`/api/v1/users/requests/${requestId}`)
      .set('Accept', 'application/json')
      .expect(404);

    expect(res.body).to.be.an('object');
    expect(res.body.status).to.equal('fail');
    expect(res.body.data).not.to.have.property('requests');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('This request is not found in the database');
  });
  it('should return 400 if request Id is inavalid', async () => {
    const requestId = 'asdf';
    const res = await request(app)
      .get(`/api/v1/users/requests/${requestId}`)
      .set('Accept', 'application/json')
      .expect(400);

    expect(res.body).to.be.an('object');
    expect(res.body.status).to.equal('fail');
    expect(res.body.data).not.to.have.property('requests');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('You can only enter integers as requestId');
  });
  it('should get a request by Id', async () => {
    const requestId = 5;
    const res = await request(app)
      .get(`/api/v1/users/requests/${requestId}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.status).to.equal('success');
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('result');
    expect(res.body.data.result).to.be.an('object');
  });
});
