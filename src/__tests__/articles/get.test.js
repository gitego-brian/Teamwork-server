/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

const getArticleTests = () => {
  describe('Get article tests', () => {
    beforeAll(async () => {
      await request(app).post('/api/auth/signup').send(testData.branSignup);
      const res = await request(app).post('/api/auth/login').send(testData.branLogin);
      testData.branToken = res.body.data.token;
      const res2 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBody);
      testData.branArticleId = res2.body.data.id;
    });
    afterAll(async () => {
      await db.sync({ force: true });
      // await db.close();
    });
    it('GET/ user should get all articles', async () => {
      const res = await request(app).get('/api/articles').set('Authorization', `Bearer ${testData.branToken}`);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('count');
      expect(res.body.data).toHaveProperty('articles');
    });
    it('GET/ user should get an article', async () => {
      const res = await request(app).get(`/api/articles/${testData.branArticleId}`).set('Authorization', `Bearer ${testData.branToken}`);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('article');
      expect(res.body.data).toHaveProperty('comments');
    });
    it('GET/ user should not get a non-existing article', async () => {
      const res = await request(app).get('/api/articles/0').set('Authorization', `Bearer ${testData.branToken}`);
      expect(res.status).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });
    it('GET/ user should not get a article with invalid id', async () => {
      const res = await request(app).get('/api/articles/brian').set('Authorization', `Bearer ${testData.branToken}`);
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });
};
export default getArticleTests;
