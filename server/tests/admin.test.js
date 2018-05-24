import chai from 'chai';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true, before:true */
/*  eslint no-undef: "error"  */
const { expect } = chai;
let userToken;
let adminToken;
describe('Request controller', () => {
  before(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .send({
        username: 'juliet',
        password: 'password123',
      });
    userToken = res.body.data.token;
  });
  before(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .send({
        username: 'cwizard',
        password: 'password123',
      });
    adminToken = res.body.data.token;
  });
  describe('GET /api/v1/requests', () => {
    it('should not get request if user is not login', async () => {
      const res = await request(app)
        .get('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Pls login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not get request all request if user is not an admin', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(403);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are not authorized to access this resources');
      expect(res.body.status).to.equal('fail');
    });
    it('should get all request for admin', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(200);
      expect(res.body.data).to.be.an('array');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Requests found');
      expect(res.body.status).to.equal('success');
    });
  });
  // describe('PUT /api/v1/requests/:requestId/approve', () => {
  //   it('should not approve a request if user is not logged in', async () => {
  //     const requestId = '088f8e3a-7945-42d3-8ff9-43f52ff59575';
  //     const res = await request(app)
  //       .get(`/api/v1/requests/${requestId}/approve`)
  //       .set('Accept', 'application/json')
  //       .expect(401);
  //     expect(res.body).to.have.a.property('message');
  //     expect(res.body.message).to.equal('Pls login with your username and password');
  //     expect(res.body).not.to.have.a.property('data');
  //   });
  //   it('should not approve a request if user is not an admin', async () => {
  //     const requestId = '088f8e3a-7945-42d3-8ff9-43f52ff59575';
  //     const res = await request(app)
  //       .get(`/api/v1/requests/${requestId}/approve`)
  //       .set('Accept', 'application/json')
  //       .set('token', userToken)
  //       .expect(403);
  //     expect(res.body).to.have.a.property('message');
  //     expect(res.body.message).to.equal('You are not authorized to access this resources');
  //     expect(res.body.status).to.equal('fail');
  //   });
  //   it('should not approve a request if request id is not found', async () => {
  //     const requestId = '088f8e3a-7945-42d3-8ff9-43f52ff50575';
  //     const res = await request(app)
  //       .get(`/api/v1/requests/${requestId}/approve`)
  //       .set('Accept', 'application/json')
  //       .set('token', adminToken)
  //       .expect(404);
  //     expect(res.body).to.have.a.property('message');
  //     expect(res.body.message).to.equal('This request is not found in the database');
  //     expect(res.body.status).to.equal('fail');
  //   });
  //   it('should approve a valid request', async () => {
  //     const requestId = '088f8e3a-7945-42d3-8ff9-43f52ff59575';
  //     const res = await request(app)
  //       .get(`/api/v1/requests/${requestId}/approve`)
  //       .set('Accept', 'application/json')
  //       .set('token', adminToken)
  //       .expect(404);
  //     expect(res.body).to.have.a.property('message');
  //     expect(res.body.message).to.equal('Request approved');
  //     expect(res.body.status).to.equal('success');
  //   });
  // });
});
