/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import { testLog } from '../../config/debug';
import testData from '../_testData_/testData';

const deleteArticleTests = () => {
  describe('Delete article tests', () => {
    beforeAll(async () => {
      await request(app).post('/api/auth/signup').send(testData.branSignup);
      const res = await request(app).post('/api/auth/signup').send(testData.jonSignup);
      testData.jonToken = res.body.data.token;
      await request(app).patch('/api/auth/users/toggleadmin').set('Authorization', `Bearer ${testData.jonToken}`).send(testData.makeBranAdmin);
      const res2 = await request(app).post('/api/auth/login').send(testData.branLogin);
      testLog.aDelete(res2.body);
      testData.branToken = res2.body.data.token;
      const res3 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBody);
      testData.branArticleId = res3.body.data.id;
      const res4 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.jonToken}`).send(testData.article2Body);
      testData.jonArticleId = res4.body.data.id;
    });
    afterAll(async () => {
      await db.sync({ force: true });
    // await db.close();
    });
    it("DELETE/ user should not delete another's article", async () => {
      const res = await request(app).delete(`/api/articles/${testData.jonArticleId}`).set('Authorization', `Bearer ${testData.branToken}`);
      expect(res.status).toEqual(403);
      expect(res.body).toHaveProperty('error');
    });
    it('POST/ user should flag an article', async () => {
      const res = await request(app)
        .post(`/api/articles/${testData.jonArticleId}/flags`)
        .set('Authorization', `Bearer ${testData.branToken}`)
        .send(testData.flagBody);
      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty('message');
    });
    it('DELETE/ admin should delete a flagged article', async () => {
      const res = await request(app).delete(`/api/articles/${testData.jonArticleId}`).set('Authorization', `Bearer ${testData.branToken}`);
      testLog.aDelete(res.body);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });
    it('DELETE/ user should delete their article', async () => {
      const res = await request(app).delete(`/api/articles/${testData.branArticleId}`).set('Authorization', `Bearer ${testData.branToken}`);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });
    it('DELETE/ user should not delete a article with invalid id', async () => {
      const res = await request(app).delete('/api/articles/brian').set('Authorization', `Bearer ${testData.branToken}`);
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });
};
export default deleteArticleTests;
