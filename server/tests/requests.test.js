import chai from 'chai';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true  */
/*  eslint no-undef: "error"  */

const { expect } = chai;

describe('GET /api/v1/users/requests', () => {
  it('should get all requests', async () => {
    const res = await request(app)
      .get('/api/v1/users/requests')
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.status).to.equal('ok');
    expect(res.body.code).to.equal(200);
    expect(res.body).to.have.property('result');
    expect(res.body.result).to.have.property('requests');
    expect(res.body.result.requests[0]).to.be.an('object');
  });
});
