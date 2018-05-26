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
      expect(res.body.message).to.equal('Title is required to post a request');
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
      expect(res.body.message).to.equal('Title is required to post a request');
    });
    it('should not post a request with invalid title', async () => {
      const request2 = {
        title: '4 big fool',
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
      expect(res.body.message).to.equal('Your title must start with alphabet');
    });
    it('should not post a request with title longer than 50', async () => {
      const request2 = {
        title: 'hggjgj ffkkfj jkgjgf fkfkfkfg kdjkdkf djkfkdf kkfkf kdkdfkf kfkfjk kdffjkfk kjkfjkf kjfj k fk ffjf ',
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
      expect(res.body.message).to.equal('Please enter a shorter title less than 50 characters');
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
      expect(res.body.message).to.equal('Details of the request is required to post a request');
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
      expect(res.body.message).to.equal('Details of the request is required to post a request');
    });
    it('should not post a request with invalid details', async () => {
      const request2 = {
        title: 'big bowl',
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
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Details must start with alphabets');
    });
    it('should not post a request with longer details', async () => {
      const request2 = {
        title: 'big bowl',
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
      expect(res.body).not.to.have.property('data');
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
    it('should not allow admin to post a request', async () => {
      const request2 = {
        title: 'big bowl',
        details: 'This is a new request',
      };
      const res = await request(app)
        .post('/api/v1/users/requests')
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .send(request2)
        .expect(403);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Administrators are not allowed to create request');
    });
    it('should not post an existing request', async () => {
      const request2 = {
        title: 'big bowl',
        details: 'This is a new request',
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
        .expect(404);

      expect(res.body.status).to.equal('fail');
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
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Invalid Id, please provide a valid uuid');
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
      expect(res.body.data).to.be.an('array');
      expect(res.body.message).to.equal('One request successfully retrieved from the database');
    });
  });
  describe('PUT /api/v1/users/requests/:requestId', () => {
    it('should not edit a request that is not found', async () => {
      const requestId = 'd5043ca9-ed83-489c-9bc9-0b420577b7b5';
      const request2 = {
        title: 'big bowl 2',
        details: 'This is a new request',
      };
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send(request2)
        .expect(401);

      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('You can\'t edit a request that is not yours');
    });
    it('should return 400 if request id is invalid', async () => {
      const requestId = '1324dsg';
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          title: 'new request',
          details: 'new new new request',
        })
        .expect(400);
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Invalid Id, please provide a valid uuid');
    });
    it('should not edit request if title is not given', async () => {
      const requestId = '1324dsg';
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          details: 'new new new request',
        })
        .expect(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Title is required to post a request');
    });
    it('should not edit request if details is not given', async () => {
      const requestId = '1324dsg';
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          title: 'new new new request',
        })
        .expect(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Details of the request is required to post a request');
    });
    it('should not edit request that doesn\'t belong to you', async () => {
      const requestId = 'd5043ca9-ed83-489c-9bc9-0b420577b7b5';
      const request2 = {
        title: 'big bowl 2',
        details: 'This is a new request',
      };
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken2)
        .send(request2)
        .expect(401);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('You can\'t edit a request that is not yours');
    });
    it('should edit a user request', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e42';
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          title: 'edited in test mode',
          details: 'newly edited request',
        })
        .expect(200);
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('message');
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('Request successfully updated');
    });
    it('should not edit a user request that the admin has approved or rejected', async () => {
      const requestId = '0ce529f4-8854-41ec-b67c-fbcb4e716e45';
      const res = await request(app)
        .put(`/api/v1/users/requests/${requestId}`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          title: 'edited in test mode1',
          details: 'newly edited request',
        })
        .expect(403);
      expect(res.body.status).to.equal('fail');
      expect(res.body).to.have.property('message');
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Admin has already looked into this request, Please check the current status of the request');
    });
  });
});
