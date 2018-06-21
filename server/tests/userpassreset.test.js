import chai from 'chai';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true, */
/*  eslint no-undef: "error"  */

const { expect } = chai;

describe('POST /api/v1/auth/passwordreset', () => {
  it('should not send password reset mail if username or password is not supplied', async () => {
    const res = await request(app)
      .post('/api/v1/auth/passwordreset')
      .set('Accept', 'application/json')
      .send({})
      .expect(400);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message).to.equal('Username or email is required to to make request for password reset');
    expect(res.body.status).to.equal('fail');
  });
  it('should not send password reset mail if email is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/passwordreset')
      .set('Accept', 'application/json')
      .send({
        email: 'invalid',
      })
      .expect(400);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message.errors.email[0]).to.equal('The email format is invalid.');
    expect(res.body.status).to.equal('fail');
  });
  it('should not send password reset mail if user is not found in the database', async () => {
    const res = await request(app)
      .post('/api/v1/auth/passwordreset')
      .set('Accept', 'application/json')
      .send({
        email: 'invalid@gmail.com',
      })
      .expect(404);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message).to.equal('User not found in the database');
    expect(res.body.status).to.equal('fail');
  });
  it('should send password reset mail if username or email is valid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/passwordreset')
      .set('Accept', 'application/json')
      .send({
        email: 'sjuliet07@gmail.com',
      })
      .expect(200);
    expect(res.body).to.have.a.property('message');
    expect(res.body).to.have.a.property('data');
    expect(res.body.data).to.be.an('object');
    expect(res.body.message).to.equal('Password reset link has been successfully sent to your email, please check your email');
    expect(res.body.status).to.equal('success');
  });
});
describe('GET /api/v1/auth/resetpassword/:id/:token', () => {
  it('should not decode payload if id is invalid not supplied', async () => {
    const id = '55';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4YTY5OGEwLTE2NDEtNWFjYS1iYzFiLWRlOWIxYTQ4MmVlMSIsImVtYWlsIjoic2p1bGlldDA3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoianVsaWV0IiwiaWF0IjoxNTI5NTI4NTA0LCJleHAiOjE1Mjk1MzIxMDR9.9LGyxN-_yehlqBQ3XKOhWAoCvLbKpX8RyKjW3mqgicM';
    const res = await request(app)
      .get(`/api/v1/auth/resetpassword/${id}/${token}`)
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message).to.equal('Invalid id, please use a valid user uuid');
    expect(res.body.status).to.equal('fail');
  });
  it('should not decode payload if user not found', async () => {
    const id = '48a698a0-1641-5aca-bc1b-de9b1a482ee9';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4YTY5OGEwLTE2NDEtNWFjYS1iYzFiLWRlOWIxYTQ4MmVlMSIsImVtYWlsIjoic2p1bGlldDA3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoianVsaWV0IiwiaWF0IjoxNTI5NTI4NTA0LCJleHAiOjE1Mjk1MzIxMDR9.9LGyxN-_yehlqBQ3XKOhWAoCvLbKpX8RyKjW3mqgicM';
    const res = await request(app)
      .get(`/api/v1/auth/resetpassword/${id}/${token}`)
      .set('Accept', 'application/json')
      .expect(404);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message).to.equal('User not found in the database');
    expect(res.body.status).to.equal('fail');
  });
  it('should decode payload if id and token are valid', async () => {
    const id = '48a698a0-1641-5aca-bc1b-de9b1a482ee1';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4YTY5OGEwLTE2NDEtNWFjYS1iYzFiLWRlOWIxYTQ4MmVlMSIsImVtYWlsIjoic2p1bGlldDA3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoianVsaWV0IiwiaWF0IjoxNTI5NTI4NTA0LCJleHAiOjE1Mjk1MzIxMDR9.9LGyxN-_yehlqBQ3XKOhWAoCvLbKpX8RyKjW3mqgicM';
    const res = await request(app)
      .get(`/api/v1/auth/resetpassword/${id}/${token}`)
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).to.have.a.property('message');
    expect(res.body.data).to.have.a.property('payload');
    expect(res.body.message).to.equal('Token successfully decoded, please enter a new password in the provided form');
    expect(res.body.status).to.equal('success');
  });
});
describe('POST /api/v1/auth/resetpassword', () => {
  it('should not reset password if token is not supplied', async () => {
    const res = await request(app)
      .post('/api/v1/auth/resetpassword')
      .set('Accept', 'application/json')
      .send({
        id: '48a698a0-1641-5aca-bc1b-de9b1a482ee1',
        password: 'september1985',
      })
      .expect(400);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message.errors.token[0]).to.equal('The token field is required.');
    expect(res.body.status).to.equal('fail');
  });
  it('should not reset password if id is not supplied', async () => {
    const res = await request(app)
      .post('/api/v1/auth/resetpassword')
      .set('Accept', 'application/json')
      .send({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4YTY5OGEwLTE2NDEtNWFjYS1iYzFiLWRlOWIxYTQ4MmVlMSIsImVtYWlsIjoic2p1bGlldDA3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoianVsaWV0IiwiaWF0IjoxNTI5NTI4NTA0LCJleHAiOjE1Mjk1MzIxMDR9.9LGyxN-_yehlqBQ3XKOhWAoCvLbKpX8RyKjW3mqgicM',
        password: 'september1985',
      })
      .expect(400);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message.errors.id[0]).to.equal('The id field is required.');
    expect(res.body.status).to.equal('fail');
  });
  it('should not reset password if password is not supplied', async () => {
    const res = await request(app)
      .post('/api/v1/auth/resetpassword')
      .set('Accept', 'application/json')
      .send({
        id: '48a698a0-1641-5aca-bc1b-de9b1a482ee1',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4YTY5OGEwLTE2NDEtNWFjYS1iYzFiLWRlOWIxYTQ4MmVlMSIsImVtYWlsIjoic2p1bGlldDA3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoianVsaWV0IiwiaWF0IjoxNTI5NTI4NTA0LCJleHAiOjE1Mjk1MzIxMDR9.9LGyxN-_yehlqBQ3XKOhWAoCvLbKpX8RyKjW3mqgicM',
      })
      .expect(400);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message.errors.password[0]).to.equal('The password field is required.');
    expect(res.body.status).to.equal('fail');
  });
  it('should not reset password if id is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/resetpassword')
      .set('Accept', 'application/json')
      .send({
        id: '48',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4YTY5OGEwLTE2NDEtNWFjYS1iYzFiLWRlOWIxYTQ4MmVlMSIsImVtYWlsIjoic2p1bGlldDA3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoianVsaWV0IiwiaWF0IjoxNTI5NTI4NTA0LCJleHAiOjE1Mjk1MzIxMDR9.9LGyxN-_yehlqBQ3XKOhWAoCvLbKpX8RyKjW3mqgicM',
        password: 'september123',
      })
      .expect(400);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message).to.equal('Invalid id, please use a valid user uuid');
    expect(res.body.status).to.equal('fail');
  });
  it('should not reset password if token is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/resetpassword')
      .set('Accept', 'application/json')
      .send({
        id: '48a698a0-1641-5aca-bc1b-de9b1a482ee1',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCIkpXVCJ9.eyJpZCI6IjQ4YTY5OGEwLTE2EtNWFjYS1iYzFiLWRlOWIxYTQ4MmVlMSIsImVtlsIjoic2p1bGlldDA3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoianVsaWV0IiwiaWF0IjoxNTI5NTI4NTA0LCJleHAiOjE1Mjk1MzIxMDR9.9LGyxN-_yehlqBQ3XKOhWAoCvLbKpX8RyKjW3mqgicM',
        password: 'september123',
      })
      .expect(400);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message).to.equal('Invalid token, please use a valid token');
    expect(res.body.status).to.equal('fail');
  });
  it('should reset password if token, id and password are supplied', async () => {
    const res = await request(app)
      .post('/api/v1/auth/resetpassword')
      .set('Accept', 'application/json')
      .send({
        id: '48a698a0-1641-5aca-bc1b-de9b1a482ee1',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4YTY5OGEwLTE2NDEtNWFjYS1iYzFiLWRlOWIxYTQ4MmVlMSIsImVtYWlsIjoic2p1bGlldDA3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoianVsaWV0IiwiaWF0IjoxNTI5NTI4NTA0LCJleHAiOjE1Mjk1MzIxMDR9.9LGyxN-_yehlqBQ3XKOhWAoCvLbKpX8RyKjW3mqgicM',
        password: 'september1989',
      })
      .expect(200);
    expect(res.body).to.have.a.property('message');
    expect(res.body).to.have.a.property('data');
    expect(res.body.data).to.be.an('object');
    expect(res.body.message).to.equal('Password has been successfully changed, please login with your new password');
    expect(res.body.status).to.equal('success');
  });
});
