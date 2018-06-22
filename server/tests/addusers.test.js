import chai from 'chai';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true, before:true; */
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
  describe('POST /api/v1/auth/signup', () => {
    it('should return error if no password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'adeola',
          email: 'invalid@email.com',
          firstname: 'Peter',
          lastname: 'Adeoye',
        })
        .expect(400);
      expect(res.body.message.errors.password[0]).to.equal('The password field is required.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error for incorrect password combination', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'adeola',
          password: '123abc@546',
          firstname: 'Peter',
          lastname: 'Adeoye',
          email: 'invalid@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.password[0]).to.equal('The password field must be alphanumeric.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if password length is less than 8', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'adeola',
          firstname: 'Peter',
          lastname: 'Adeoye',
          password: '123abc',
          email: 'invalid@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.password[0]).to.equal('The password must be at least 8 characters.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if password is not alphanumeric', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'adeola',
          firstname: 'Peter',
          lastname: 'Adeoye',
          password: 'password abc',
          email: 'invalid@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.password[0]).to.equal('The password field must be alphanumeric.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error for invalid username', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: '123d@fcs',
          firstname: 'Peter',
          lastname: 'Adeoye',
          password: '123abc345',
          email: 'invalid@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.username[0]).to.equal('The username field must be alphanumeric.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if no username', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          firstname: 'Peter',
          lastname: 'Adeoye',
          password: '123abc345',
          email: 'invalid@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.username[0]).to.equal('The username field is required.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });

    it('should return error if no email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter',
          firstname: 'Peter',
          lastname: 'Adeoye',
          password: '123abc345',
        })
        .expect(400);
      expect(res.body.message.errors.email[0]).to.equal('The email field is required.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if email is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter',
          firstname: 'Peter',
          lastname: 'Adeoye',
          password: '123abc345',
          email: 'invalid',
        })
        .expect(400);
      expect(res.body.message.errors.email[0]).to.equal('The email format is invalid.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if no first name', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter',
          lastname: 'Adeoye',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.firstname[0]).to.equal('The firstname field is required.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if no last name', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter',
          firstname: 'Peter',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.lastname[0]).to.equal('The lastname field is required.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if first name is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter',
          firstname: '5425Peter',
          lastname: 'Adeoye',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.firstname[0]).to.equal('The firstname field must contain only alphabetic characters.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if last name is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter',
          firstname: 'Peter',
          lastname: '5443Adeoye',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.lastname[0]).to.equal('The lastname field must contain only alphabetic characters.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if firstname name is short', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter',
          firstname: 'Pi',
          lastname: '5443Adeoye',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.firstname[0]).to.equal('The firstname must be at least 3 characters.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if last name is short', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter',
          firstname: 'Peter',
          lastname: 'Ad',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.lastname[0]).to.equal('The lastname must be at least 3 characters.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if username is too long', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peterade2018adeyemipeters',
          firstname: 'Peter',
          lastname: 'Adeoye',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.username[0]).to.equal('The username may not be greater than 15 characters.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if first name is too long', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter75',
          firstname: 'Peteradeolaoluwatobiloba',
          lastname: 'Adeoye',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.firstname[0]).to.equal('The firstname may not be greater than 15 characters.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if last name is too long', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'peter75',
          firstname: 'Peter',
          lastname: 'AdeoyeolaoluwaIamtoolong',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(400);
      expect(res.body.message.errors.lastname[0]).to.equal('The lastname may not be greater than 15 characters.');
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if username exist', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'juliet',
          firstname: 'Peter',
          lastname: 'Adeoye',
          password: '123abc345',
          email: 'email@email.com',
        })
        .expect(409);
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should return error if email exist', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'juliet20',
          firstname: 'Peter',
          lastname: 'Adeoye',
          password: '123abc345',
          email: 'cwizard2011@gmail.com',
        })
        .expect(409);
      expect(res.body).to.have.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should post a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({
          username: 'adeola1',
          firstname: 'Peter',
          lastname: 'Adeola',
          password: 'hdddbd73464b',
          email: 'peteradeola2011@email.com',
        })
        .expect(201);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('User registration successful');
      expect(res.body.data.user).to.have.a.property('username');
      expect(res.body.data.user).to.have.a.property('email');
      expect(res.body.data.user).to.have.a.property('id');
    });
  });
  describe('POST /auth/login', () => {
    it('should not login a user without password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({
          username: 'juliet',
        })
        .expect(400);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Password is required to login');
      expect(res.body).to.not.have.property('data');
    });
    it('should not login a user without username', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({
          password: 'password2',
        })
        .expect(400);
      expect(res.body).to.have.a.property('message');
      expect(res.body).to.not.have.property('data');
    });
    it('should not login a user if username incorrect', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({
          username: 'incorrect1',
          password: 'password2',
        })
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Email/username invalid, please provide valid credentials');
      expect(res.body).to.not.have.property('data');
    });
    it('should not login a user if email incorrect', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'incorrect1@gmail.com',
          password: 'password2',
        })
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Email/username invalid, please provide valid credentials');
      expect(res.body).to.not.have.property('data');
    });
    it('should not login a user if password incorrect', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({
          username: 'juliet',
          password: 'incorrect',
        })
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Password incorrect, try again');
      expect(res.body).to.not.have.property('data');
    });
    it('should login a user with valid username and password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({
          username: 'juliet',
          password: 'password123',
        })
        .expect(200);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are now logged in');
      expect(res.body.data).to.have.a.property('username');
      expect(res.body.data).to.have.a.property('token');
    });
    it('should login a user with valid email and password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'sjuliet07@gmail.com',
          password: 'password123',
        })
        .expect(200);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are now logged in');
      expect(res.body.data).to.have.a.property('email');
      expect(res.body.data).to.have.a.property('token');
    });
  });
  describe('GET /api/v1/users/profile', () => {
    it('should not return profile info if user not logged in', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body.status).to.equal('fail');
    });
    it('should not return profile info for authenticated user', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(200);
      expect(res.body).to.have.a.property('message');
      expect(res.body).to.have.a.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('Profile successfully retrieved');
      expect(res.body.status).to.equal('success');
    });
  });
  describe('GET /api/v1/users', () => {
    it('should not get lists of users if user is not login', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not get list of all users if user is not an admin', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(403);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are not authorized to access this resources');
      expect(res.body.status).to.equal('fail');
    });
    it('should get list of all users for admin', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(200);
      expect(res.body.data).to.be.an('array');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Users successfully retrieved from the database');
      expect(res.body.status).to.equal('success');
    });
  });
  describe('PUT /api/v1/user/role/:userId/update', () => {
    it('should not update a user role with invalid id', async () => {
      const userId = '1424fff';
      const res = await request(app)
        .put(`/api/v1/user/role/${userId}/update`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Invalid id, please use a valid uuid');
      expect(res.body.status).to.equal('fail');
    });
    it('should not update a user role if user not authenticated', async () => {
      const userId = '48a698a0-1641-5aca-bc1b-de9b1a482ee1';
      const res = await request(app)
        .put(`/api/v1/user/role/${userId}/update`)
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not update a user role if  user is not an admin', async () => {
      const userId = '48a698a0-1641-5aca-bc1b-de9b1a482ee1';
      const res = await request(app)
        .put(`/api/v1/user/role/${userId}/update`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(403);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are not authorized to access this resources');
      expect(res.body.status).to.equal('fail');
    });
    it('should update a user role to admin', async () => {
      const userId = '48a698a0-1641-5aca-bc1b-de9b1a482ee1';
      const res = await request(app)
        .put(`/api/v1/user/role/${userId}/update`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.user_role).to.equal('admin');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Users role successfully upgraded to admin');
      expect(res.body.status).to.equal('success');
    });
    it('should update an admin role to user', async () => {
      const userId = '48a698a0-1641-5aca-bc1b-de9b1a482ee1';
      const res = await request(app)
        .put(`/api/v1/user/role/${userId}/update`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.user_role).to.equal('users');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('User has been stripped of admin priviledges');
      expect(res.body.status).to.equal('success');
    });
  });

  describe('DELETE /api/v1/users/:userId/remove', () => {
    it('should not delete a user if id is invalid', async () => {
      const userId = '1424fff';
      const res = await request(app)
        .delete(`/api/v1/users/${userId}/remove`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Invalid id, please use a valid uuid');
      expect(res.body.status).to.equal('fail');
    });
    it('should not delete a user if user not authenticated', async () => {
      const userId = '48a698a0-1641-5aca-bc1b-de9b1a482ee1';
      const res = await request(app)
        .delete(`/api/v1/users/${userId}/remove`)
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not delete a user if user is not admin', async () => {
      const userId = '48a698a0-1641-5aca-bc1b-de9b1a482ee2';
      const res = await request(app)
        .delete(`/api/v1/users/${userId}/remove`)
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(403);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You are not authorized to access this resources');
      expect(res.body.status).to.equal('fail');
    });
    it('should not delete a user if user doesnt exist', async () => {
      const userId = '48a698a0-1641-5aca-bc1b-de9b1a482ee9';
      const res = await request(app)
        .delete(`/api/v1/users/${userId}/remove`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(404);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('User not found in the database');
      expect(res.body.status).to.equal('fail');
    });
    it('should not delete an admin', async () => {
      const userId = '4c832e31-04d3-4ba7-b8d7-0172de09c775';
      const res = await request(app)
        .delete(`/api/v1/users/${userId}/remove`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(405);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('You can\'t delete an admin, you have to remove the admin privileges first');
      expect(res.body.status).to.equal('fail');
    });
    it('should delete a user', async () => {
      const userId = '48a698a0-1641-5aca-bc1b-de9b1a482ee3';
      const res = await request(app)
        .delete(`/api/v1/users/${userId}/remove`)
        .set('Accept', 'application/json')
        .set('token', adminToken)
        .expect(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('User successfully deleted');
      expect(res.body.status).to.equal('success');
    });
  });
});
