import chai from 'chai';
import path from 'path';
import request from 'supertest';
import app from '../app';

/*  global describe:true, it:true, before:true */
/*  eslint no-undef: "error"  */
const { expect } = chai;
let userToken;

describe('Image controller', () => {
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

  describe('Image Controller', () => {
    it('should not get image for non-authenticated user', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile/image')
        .set('Accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body.status).to.equal('fail');
    });
    it('should return 200 if user doesnt have image', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile/image')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(200);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please upload a profile image');
      expect(res.body.status).to.equal('success');
    });
    it('should not post image for non-authenticated user', async () => {
      const res = await request(app)
        .put('/api/v1/users/profile/image')
        .set('Accept', 'application/json')
        .attach('image', path.join(__dirname, 'images/profile.jpeg'))
        .expect(401);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('Please login with your username and password');
      expect(res.body.status).to.equal('fail');
    });
    it('should return error 400 if no image is attached', async () => {
      const res = await request(app)
        .put('/api/v1/users/profile/image')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .expect(400);
      expect(res.body).to.have.a.property('message');
      expect(res.body.message).to.equal('No image was attached, please attach an image');
      expect(res.body.status).to.equal('fail');
    });
    it('should upload image', async () => {
      const res = await request(app)
        .put('/api/v1/users/profile/image')
        .set('Accept', 'application/json')
        .set('token', userToken)
        .attach('image', path.join(__dirname, 'images/profile.jpeg'))
        .expect(200);
      expect(res.body).to.have.a.property('message');
      expect(res.body).to.have.a.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('Image uploaded successfully');
      expect(res.body.status).to.equal('success');
    });
  });
});
