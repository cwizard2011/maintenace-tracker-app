import chai from 'chai';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true */
/*  eslint no-undef: "error"  */

const { expect } = chai;

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
    expect(res.body.message).to.equal('Password must be supplied');
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
    expect(res.body.message).to.equal('Password must be alphanumeric and should contain a minimum of 8 characters');
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
    expect(res.body.message).to.equal('Password must be alphanumeric and should contain a minimum of 8 characters');
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('data');
  });
  it('should return error for invalid username', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send({
        username: '123dfcs',
        firstname: 'Peter',
        lastname: 'Adeoye',
        password: '123abc345',
        email: 'invalid@email.com',
      })
      .expect(400);
    expect(res.body.message).to.equal('Invalid username, username can only be a min. of 3 and max of 10 alphanumeric characters starting with letters');
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
    expect(res.body.message).to.equal('You must provide a username');
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
    expect(res.body.message).to.equal('You must provide an email address');
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
    expect(res.body.message).to.equal('Invalid email, please enter correct email');
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
    expect(res.body.message).to.equal('You must provide your first Name');
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
    expect(res.body.message).to.equal('You must provide your last Name');
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
    expect(res.body.message).to.equal('Invalid Name, name can only contain alphabets');
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
    expect(res.body.message).to.equal('Invalid Name, name can only contain alphabets');
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('data');
  });
  it('should return error if username is too long', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send({
        username: 'peter754hyfnuyrnus6hnnsduerwjn8nshdn',
        firstname: 'Peter',
        lastname: 'Adeoye',
        password: '123abc345',
        email: 'email@email.com',
      })
      .expect(400);
    expect(res.body.message).to.equal('Invalid username, username can only be a min. of 3 and max of 10 alphanumeric characters starting with letters');
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('data');
  });
  it('should return error if first name is too long', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send({
        username: 'peter75',
        firstname: 'Peteroiuetfvbdbdbdgfdbdmnddbhsdhsghsghsfhndfdfbnfbnfnfvbfffnfffbnff',
        lastname: 'Adeoye',
        password: '123abc345',
        email: 'email@email.com',
      })
      .expect(400);
    expect(res.body.message).to.equal('Name too long, please restrict name to 20 characters including spaces');
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
        lastname: 'Adeoyeoiuetfvbdbdbdgfdbdmnddbhsdhsghsghsfhndfdfbnfbnfnfvbfffnfffbnff',
        password: '123abc345',
        email: 'email@email.com',
      })
      .expect(400);
    expect(res.body.message).to.equal('Name too long, please restrict name to 20 characters including spaces');
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
    expect(res.body.message).to.equal('User already exist, please sign in with your username and password');
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('data');
  });
  it('should return error if email exist', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send({
        username: 'juliet2014',
        firstname: 'Peter',
        lastname: 'Adeoye',
        password: '123abc345',
        email: 'sjuliet07@gmail.com',
      })
      .expect(409);
    expect(res.body.message).to.equal('User already exist, please sign in with your username and password');
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
    expect(res.body.message).to.equal('Please provide your password');
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
    expect(res.body.message).to.equal('Please provide your username');
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
    expect(res.body.message).to.equal('Username or password incorrect, please provide valid credential');
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
    expect(res.body.message).to.equal('Username or password incorrect, try again');
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
});
