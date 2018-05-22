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
        firstName: 'Peter',
        lastName: 'Adeoye',
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
        firstName: 'Peter',
        lastName: 'Adeoye',
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
        firstName: 'Peter',
        lastName: 'Adeoye',
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
        firstName: 'Peter',
        lastName: 'Adeoye',
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
        firstName: 'Peter',
        lastName: 'Adeoye',
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
        firstName: 'Peter',
        lastName: 'Adeoye',
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
        firstName: 'Peter',
        lastName: 'Adeoye',
        password: '123abc345',
        email: 'invalid',
      })
      .expect(400);
    expect(res.body.message).to.equal('invalid email, please enter correct email');
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('data');
  });
  it('should return error if no first name', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send({
        username: 'peter',
        lastName: 'Adeoye',
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
        firstName: 'Peter',
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
        firstName: '5425Peter',
        lastName: 'Adeoye',
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
        firstName: 'Peter',
        lastName: '5443Adeoye',
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
        firstName: 'Peter',
        lastName: 'Adeoye',
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
        firstName: 'Peteroiuetfvbdbdbdgfdbdmnddbhsdhsghsghsfhndfdfbnfbnfnfvbfffnfffbnff',
        lastName: 'Adeoye',
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
        firstName: 'Peter',
        lastName: 'Adeoyeoiuetfvbdbdbdgfdbdmnddbhsdhsghsghsfhndfdfbnfbnfnfvbfffnfffbnff',
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
        firstName: 'Peter',
        lastName: 'Adeoye',
        password: '123abc345',
        email: 'email@email.com',
      })
      .expect(409);
    expect(res.body.message).to.equal('User already exist, pls sign in with your username and password');
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('data');
  });
  it('should return error if email exist', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send({
        username: 'juliet2014',
        firstName: 'Peter',
        lastName: 'Adeoye',
        password: '123abc345',
        email: 'sjuliet07@gmail.com',
      })
      .expect(409);
    expect(res.body.message).to.equal('User already exist, pls sign in with your username and password');
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('data');
  });
  it('should post a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send({
        username: 'adeola1',
        firstName: 'Peter',
        lastName: 'Adeola',
        password: 'hdddbd73464b',
        email: 'peteradeola2011@email.com',
      })
      .expect(201);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message).to.equal('User registration successful');
    expect(res.body.data.user).to.have.a.property('username');
    expect(res.body.data.user).to.have.a.property('password');
    expect(res.body.data.user).to.have.a.property('email');
    expect(res.body.data.user).to.have.a.property('id');
  });
});
