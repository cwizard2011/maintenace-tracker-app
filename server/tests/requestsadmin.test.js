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
      expect(res.body.message).to.equal('Please login with your username and password');
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
      expect(res.body.message).to.equal('All requests successfully retrieved');
      expect(res.body.status).to.equal('success');
    });
  });
  describe('PUT /api/v1/requests/:requestId/approve', () => {
    it('should not approve a request with invalid id', async () => {
      const requestId = '1424fff';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/approve`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Invalid Id, please provide a valid uuid');
      expect(res.body.status).to.equal('fail');
    });
    it('should not approve a request when user not authenticated', async () => {
      const requestId = '1424fff';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/approve`)
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not approve a request if user is not an admin', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e42';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/approve`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(403);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are not authorized to access this resources');
      expect(res.body.status).to.equal('fail');
    });
    it('should not approve a request that the status has changed from pending', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e43';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/approve`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(405);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('The status of this request has been changed, you can\'t approve or disapprove again, please check the status');
      expect(res.body.status).to.equal('fail');
    });
    it('should approve a request if user is an admin', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e49';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/approve`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Request has been approved');
      expect(res.body.status).to.equal('success');
    });
  });
  describe('PUT /api/v1/requests/:requestId/disapprove', () => {
    it('should not disapprove a request with invalid id', async () => {
      const requestId = '1424fff';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/disapprove`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Invalid Id, please provide a valid uuid');
      expect(res.body.status).to.equal('fail');
    });
    it('should not disapprove a request when user not authenticated', async () => {
      const requestId = '1424fff';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/disapprove`)
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not disapprove a request if user is not an admin', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e47';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/disapprove`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          title: 'New edited request',
          details: 'Latest edited',
        })
        .expect(403);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are not authorized to access this resources');
      expect(res.body.status).to.equal('fail');
    });
    it('should not disapprove a request that the status has changed from pending', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e45';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/disapprove`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(405);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('The status of this request has been changed, you can\'t approve or disapprove again, please check the status');
      expect(res.body.status).to.equal('fail');
    });
    it('should disapprove a request if user is an admin', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e48';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/disapprove`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Request has been successfully rejected');
      expect(res.body.status).to.equal('success');
    });
  });
  describe('PUT /api/v1/requests/:requestId/resolve', () => {
    it('should not resolve a request with invalid id', async () => {
      const requestId = '1424fff';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Invalid Id, please provide a valid uuid');
      expect(res.body.status).to.equal('fail');
    });
    it('should not resolve a request when user not authenticated', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e45';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not resolve a request if user is not an admin', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e45';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(403);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are not authorized to access this resources');
      expect(res.body.status).to.equal('fail');
    });
    it('should not resolve a pending request', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e70';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(405);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('This request has not been approved, Please check the current status of the request');
      expect(res.body.status).to.equal('fail');
    });
    it('should not resolve a rejected request', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e43';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(405);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('This request has not been approved, Please check the current status of the request');
      expect(res.body.status).to.equal('fail');
    });
    it('should resolve an admin approved request', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e55';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Request has been successfully resolved');
      expect(res.body.status).to.equal('success');
    });
  });
  describe('PUT /api/v1/requests/:requestId/reset', () => {
    it('should not reset a request with invalid id', async () => {
      const requestId = '1424fff';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/reset`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Invalid Id, please provide a valid uuid');
      expect(res.body.status).to.equal('fail');
    });
    it('should not reset a request when user not authenticated', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e45';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/reset`)
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not reset a request if user is not an admin', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e45';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/reset`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(403);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are not authorized to access this resources');
      expect(res.body.status).to.equal('fail');
    });
    it('should not reset a pending request', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e70';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/reset`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(405);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('This is a pending request, you can\'t reset a pending request');
      expect(res.body.status).to.equal('fail');
    });
    it('should reset a non pending request', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e55';
      const res = await request(app)
        .put(`/api/v1/requests/${requestId}/reset`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('The status of this request has been sucessfully reset');
      expect(res.body.status).to.equal('success');
    });
  });
});
