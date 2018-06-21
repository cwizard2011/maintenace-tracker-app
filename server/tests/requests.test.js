import chai from 'chai';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true, before:true */
/*  eslint no-undef: "error"  */
const { expect } = chai;
let userToken;
let userToken2;
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
        username: 'peter',
        password: 'password123',
      });
    userToken2 = res.body.data.token;
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
  describe('POST /api/v1/users/requests', () => {
    it('should not post a request with no title', async () => {
      const request2 = {
        details: 'New request for new request test',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.title[0]).to.equal('The title field is required.');
    });
    it('should not post a request with no title', async () => {
      const request2 = {
        title: '      ',
        details: 'New request for new request test',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.title[0]).to.equal('The title field is required.');
    });
    it('should not post a request with title longer than 30', async () => {
      const request2 = {
        title: 'This title will be long. Then it will become longer. Oh it it becoming longer. It is growing longer, long, longer, longest. It is about to reach the limit, but not yet. Oh my God, It has reached the limit ',
        details: 'New request for new request test',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.title[0]).to.equal('The title may not be greater than 30 characters.');
    });
    it('should not post a request with no details', async () => {
      const request2 = {
        title: 'big bowl',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.details[0]).to.equal('The details field is required.');
    });
    it('should not post a request with empty details', async () => {
      const request2 = {
        title: 'big bowl',
        details: '   ',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.details[0]).to.equal('The details field is required.');
    });
    it('should not post a request with short details', async () => {
      const request2 = {
        title: 'big bowl',
        details: '5 pigs',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.details[0]).to.equal('The details must be at least 10 characters.');
    });
    it('should not post a request with longer details', async () => {
      const request2 = {
        title: 'big bowl',
        details: 'This details will be long. Then it will become longer. Oh it it becoming longer. It is growing longer, long, longer, longest. It is about to reach the limit, but not yet. Oh my God, It has reached the limit, but as I continue to make it more longer and longer and longer to the extent that I dont even know where I am going to end this long line of rubbish I call a request details',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.details[0]).to.equal('The details may not be greater than 150 characters.');
    });
    it('should post a valid request', async () => {
      const request2 = {
        title: 'Need for fixing refrigerator',
        details: 'The refrigerator in the cafeteria is damaged and need to be repaired or replaced with immediate effect',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(201);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.have.property('request');
      expect(res.body.data.request).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Request created successfully');
    });
    it('should not allow admin to post a request', async () => {
      const request2 = {
        title: 'A pen drive got broken',
        details: 'The pen drive used for transfer of files in the people department got broken today',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .send(request2)
        .expect(405);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Administrators are not allowed to create request');
    });
    it('should not post an existing request', async () => {
      const request2 = {
        title: 'Request for bulb replacement',
        details: 'Two bulbs got burnt due to high voltage and needs immediate replacement',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(409);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('This request has already been logged, Please log a new request');
    });
  });
  describe('GET /api/v1/users/requests', () => {
    it('should not get all requests if user is not logged in', async () => {
      const res = await request(app)
        .get('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not get all requests if user credential is invalid', async () => {
      const invalidToken = 'gdfsca446474';
      const res = await request(app)
        .get('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', invalidToken)
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Oops! Access denied. Kindly login');
      expect(res.body).not.to.have.a.property('data');
    });

    it('should not get request if no request in database', async () => {
      const res = await request(app)
        .get('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken2)
        .expect(200);

      expect(res.body.status).to.equal('success');
      expect(res.body.message).to.equal('No request for this user');
    });
    it('should get all requests from the database', async () => {
      const res = await request(app)
        .get('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(200);

      expect(res.body.status).to.equal('success');
      expect(res.body.message).to.equal('Requests successfully retrieved from the database');
      expect(res.body).to.have.a.property('data');
    });
  });
  describe('GET /api/v1/users/requests/:requestId', () => {
    it('should return 404 if request Id not found', async () => {
      const requestId = 'e2cfede6-7bf5-491c-9be8-a1d30ab3ce8f';
      const res = await request(app)
        .get(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(404);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('You can\'t get a request that does not belong to you');
    });
    it('should return 400 if request id is invalid', async () => {
      const requestId = '1324dsg';
      const res = await request(app)
        .get(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
    });
    it('should not get request that doesn\'t belong to a user', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e42';
      const res = await request(app)
        .get(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken2)
        .expect(404);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('You can\'t get a request that does not belong to you');
    });
    it('should get a user request', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e42';
      const res = await request(app)
        .get(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(200);
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('message');
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('One request successfully retrieved from the database');
    });
  });
  describe('PUT /api/v1/users/requests/:requestId', () => {
    it('should not edit a request that is not found', async () => {
      const requestId = 'd5043ca9-ed83-489c-9bc9-0b420577b7b5';
      const request2 = {
        title: 'big bowl 2',
      };
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(404);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('This request doesn\'t belong to you');
    });
    it('should return 400 if request id is invalid', async () => {
      const requestId = '1324dsg';
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          title: 'new request',
        })
        .expect(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Invalid Id, please provide a valid uuid');
    });
    it('should not edit request that doesn\'t belong to you', async () => {
      const requestId = 'd5043ca9-ed83-489c-9bc9-0b420577b7b5';
      const request2 = {
        title: 'big bowl 2',
      };
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken2)
        .send(request2)
        .expect(404);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('This request doesn\'t belong to you');
    });
    it('should not edit a request with title longer than 30', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e42';
      const request2 = {
        title: 'This title will be long. Then it will become longer. Oh it it becoming longer. It is growing longer, long, longer, longest. It is about to reach the limit, but not yet. Oh my God, It has reached the limit ',
      };
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.title[0]).to.equal('The title may not be greater than 30 characters.');
    });
    it('should edit a user request', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e42';
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          title: 'edited in test mode',
        })
        .expect(200);
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('message');
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('Request successfully updated');
    });
    it('should not edit a request with longer details', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e42';
      const request2 = {
        details: 'This details will be long. Then it will become longer. Oh it it becoming longer. It is growing longer, long, longer, longest. It is about to reach the limit, but not yet. Oh my God, It has reached the limit, but as I continue to make it more longer and longer and longer to the extent that I dont even know where I am going to end this long line of rubbish I call a request details',
      };
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.details[0]).to.equal('The details may not be greater than 150 characters.');
    });
    it('should not edit a user request that the admin has approved or rejected', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e45';
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          title: 'edited for testing',
        })
        .expect(405);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Admin has already looked into this request, Please check the current status of the request');
    });
  });
  describe('DELETE /api/v1/users/requests/:requestId', () => {
    it('should not delete a request not found', async () => {
      const requestId = 'd5043ca9-ed83-489c-9bc9-0b420577b7b5';
      const res = await request(app)
        .delete(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(404);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('This request doesn\'t belong to you');
    });
    it('should return 400 if request id is invalid', async () => {
      const requestId = '1324dsg';
      const res = await request(app)
        .delete(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Invalid Id, please provide a valid uuid');
    });
    it('should not delete a request that doesn\'t belong to you', async () => {
      const requestId = 'd5043ca9-ed83-489c-9bc9-0b420577b7b5';
      const res = await request(app)
        .delete(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken2)
        .expect(404);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('This request doesn\'t belong to you');
    });
    it('should delete a user request', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e42';
      const res = await request(app)
        .delete(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(200);
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('message');
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('Request successfully deleted');
    });
    it('should not delete a user request that the admin has approved or rejected', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e45';
      const res = await request(app)
        .delete(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(405);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Admin has already looked into this request, Please check the current status of the request');
    });
  });
});
