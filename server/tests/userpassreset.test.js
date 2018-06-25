import chai from 'chai';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true, before:true */
/*  eslint no-undef: "error"  */

const { expect } = chai;
let userToken;
describe('User controller', () => {
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
  describe('PUT /api/v1/users/password/update', () => {
    it('should not update password if user is not authenticated', async () => {
      const res = await request(app)
        .put('/api/v1/users/password/update')
        .set('Accept', 'application/json')
        .send({
          oldpassword: 'password123',
          newpassword: 'newpassword123',
        })
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not update password if old password is not provided', async () => {
      const res = await request(app)
        .put('/api/v1/users/password/update')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          newpassword: 'newpassword123',
        })
        .expect(400);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.oldpassword[0]).to.equal('The oldpassword field is required.');
    });
    it('should not update password if old password is not provided', async () => {
      const res = await request(app)
        .put('/api/v1/users/password/update')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          oldpassword: 'newpassword123',
        })
        .expect(400);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('fail');
      expect(res.body).not.to.have.property('data');
      expect(res.body).to.have.property('message');
      expect(res.body.message.errors.newpassword[0]).to.equal('The newpassword field is required.');
    });
    it('should not update password if oldpassword is incorrect', async () => {
      const res = await request(app)
        .put('/api/v1/users/password/update')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          oldpassword: 'password1234',
          newpassword: 'password123',
        })
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Old password incorrect, please check the old password again');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should not update password if oldpassword is the same as newpassword', async () => {
      const res = await request(app)
        .put('/api/v1/users/password/update')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          oldpassword: 'password123',
          newpassword: 'password123',
        })
        .expect(409);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('New password is the same as previous password, please change your new password');
      expect(res.body).not.to.have.a.property('data');
    });
    it('should update password', async () => {
      const res = await request(app)
        .put('/api/v1/users/password/update')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .send({
          oldpassword: 'password123',
          newpassword: 'newpassword123',
        })
        .expect(200);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Your password has been successfully updated');
      expect(res.body).to.have.a.property('data');
    });
  });
});

//

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
      .expect(404);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message).to.equal('User not found in the database');
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
  it('should not reset password if token has been used', async () => {
    const res = await request(app)
      .post('/api/v1/auth/resetpassword')
      .set('Accept', 'application/json')
      .send({
        id: '48a698a0-1641-5aca-bc1b-de9b1a482ee1',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4YTY5OGEwLTE2NDEtNWFjYS1iYzFiLWRlOWIxYTQ4MmVlMSIsImVtYWlsIjoic2p1bGlldDA3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoianVsaWV0IiwiaWF0IjoxNTI5NTI4NTA0LCJleHAiOjE1Mjk1MzIxMDR9.9LGyxN-_yehlqBQ3XKOhWAoCvLbKpX8RyKjW3mqgicM',
        password: '28thseptember1989',
      })
      .expect(409);
    expect(res.body).to.have.a.property('message');
    expect(res.body.message).to.equal('This token link has already been used, try again with a new token link');
    expect(res.body.status).to.equal('fail');
  });
});
