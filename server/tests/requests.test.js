import chai from 'chai';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true, before:true */
/*  eslint no-undef: "error"  */
const { expect } = chai;
let userToken;
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
  describe('GET /api/v1/users/requests', () => {
    it('should not get all requests if user is not logged in', async () => {
      const res = await request(app)
        .get('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Pls login with your username and password');
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

    it('should get all requests', async () => {
      const res = await request(app)
        .get('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
        .expect(404);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body.data).not.to.have.property('requests');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('This request is not found in the database');
    });
    it('should get a request by Id', async () => {
      const requestId = 5;
      const res = await request(app)
        .get(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(200);

      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('result');
      expect(res.body.data.result).to.be.an('object');
    });
  });
  describe('POST /api/v1/users/requests', () => {
    it('should not post a request with no title', async () => {
      const request2 = {
        userId: 5,
        requestId: '24',
        status: 'Pending',
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
      expect(res.body.data).not.to.have.property('request');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Title is required to post a request');
    });
    it('should not post a request with no title', async () => {
      const request2 = {
        userId: 5,
        requestId: '2',
        title: '      ',
        status: 'Pending',
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
      expect(res.body.data).not.to.have.property('request');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Title is required to post a request');
    });
    it('should not post a request with invalid title', async () => {
      const request2 = {
        userId: 5,
        requestId: '2',
        title: '4 big fool',
        status: 'Pending',
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
      expect(res.body.data).not.to.have.property('request');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Your title must start with alphabet');
    });
    it('should not post a request with title longer than 50', async () => {
      const request2 = {
        userId: 5,
        requestId: '2',
        title: 'hggjgj ffkkfj jkgjgf fkfkfkfg kdjkdkf djkfkdf kkfkf kdkdfkf kfkfjk kdffjkfk kjkfjkf kjfj k fk ffjf ',
        status: 'Pending',
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
      expect(res.body.data).not.to.have.property('request');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Please enter a shorter title less than 50 characters');
    });
    it('should not post a request with no details', async () => {
      const request2 = {
        userId: 5,
        requestId: 2,
        title: 'big bowl',
        status: 'Pending',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body.data).not.to.have.property('request');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Details of the request is required to post a request');
    });
    it('should not post a request with empty details', async () => {
      const request2 = {
        userId: 5,
        requestId: 2,
        title: 'big bowl',
        status: 'Pending',
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
      expect(res.body.data).not.to.have.property('request');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Details of the request is required to post a request');
    });
    it('should not post a request with invalid details', async () => {
      const request2 = {
        userId: 5,
        requestId: 2,
        title: 'big bowl',
        status: 'Pending',
        details: '5 pigs are parturating',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body.data).not.to.have.property('request');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Details must start with alphabets');
    });
    it('should not post a request with longer details', async () => {
      const request2 = {
        userId: 5,
        requestId: 2,
        title: 'big bowl',
        status: 'Pending',
        details: 'hfjjfhd  jsjhhhhhhhhh jf fjhfj fjhfj fhf hfjjhjhhhhhhhhhhh hhhhhhhhhhhh hhhhhhhhh hhhhhhhh hhhhhhhhh hhhhhhhh hhhhhhh hhhhhh hhhhhh hhhhhhh',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body.data).not.to.have.property('request');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Please summarise the details to 70 characters');
    });
    it('should post a valid request', async () => {
      const request2 = {
        title: 'big bowl',
        details: 'This is a new request',
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
  });
  describe('PUT /api/v1/users/requests/:requestId', () => {
    it('should return error if request id is not found', async () => {
      const requestId = 342;
      const request2 = {
        userId: 5,
        requestId: 342,
        title: 'big bowl',
        status: 'Pending',
        details: 'This is a new request',
      };
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(404);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body.data).not.to.have.property('requests');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('This request does not exist in the database');
    });
    it('should edit a request with valid Id', async () => {
      const requestId = 5;
      const request2 = {
        userId: 5,
        requestId: 2,
        title: 'big bowl',
        status: 'Pending',
        details: 'This is a new request',
      };
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(200);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.have.property('existingRequest');
      expect(res.body.data.existingRequest).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Request edited');
    });
  });
});

