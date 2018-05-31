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
    expect(res.body.message.errors.password[0]).to.equal('The password format is invalid.');
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
        password: 'passwordabc',
        email: 'invalid@email.com',
      })
      .expect(400);
    expect(res.body.message.errors.password[0]).to.equal('The password format is invalid.');
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
    expect(res.body.message.errors.username[0]).to.equal('The username format is invalid.');
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
    expect(res.body.message.errors.firstname[0]).to.equal('The firstname must be at least 5 characters.');
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
    expect(res.body.message.errors.lastname[0]).to.equal('The lastname must be at least 5 characters.');
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('data');
  });
  it('should return error if username is too long', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send({
        username: 'peterade2018',
        firstname: 'Peter',
        lastname: 'Adeoye',
        password: '123abc345',
        email: 'email@email.com',
      })
      .expect(400);
    expect(res.body.message.errors.username[0]).to.equal('The username may not be greater than 8 characters.');
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
    expect(res.body.message.errors.firstname[0]).to.equal('The firstname may not be greater than 10 characters.');
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
        lastname: 'Adeoyeolaoluwa',
        password: '123abc345',
        email: 'email@email.com',
      })
      .expect(400);
    expect(res.body.message.errors.lastname[0]).to.equal('The lastname may not be greater than 10 characters.');
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
    expect(res.body.message.errors.password[0]).to.equal('The password field is required.');
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
