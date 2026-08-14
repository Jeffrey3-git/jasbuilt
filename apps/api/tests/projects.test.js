import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/prisma/client.js';
import { resetDb, createTestUser, createTestProject } from './helpers.js';

function tokenFor(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

describe('projects', () => {
  beforeEach(resetDb);
  afterAll(async () => {
    await resetDb();
    await prisma.$disconnect();
  });

  describe('GET /api/projects', () => {
    it('returns all projects when no filter is applied', async () => {
      const { user } = await createTestUser();
      await createTestProject(user.id, { title: 'Alpha' });
      await createTestProject(user.id, { title: 'Beta' });

      const res = await request(app).get('/api/projects');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('filters to only projects seeking feedback when ?seekingFeedback=true', async () => {
      const { user } = await createTestUser();
      await createTestProject(user.id, { title: 'No feedback needed' });
      await createTestProject(user.id, {
        title: 'Please review this',
        feedbackRequest: 'Is my auth flow secure?',
      });

      const res = await request(app).get('/api/projects?seekingFeedback=true');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('Please review this');
      expect(res.body[0].feedbackRequest).toBe('Is my auth flow secure?');
    });

    it('omits seekingFeedback filter results when the flag is absent', async () => {
      const { user } = await createTestUser();
      await createTestProject(user.id, { feedbackRequest: 'Review my UI' });
      await createTestProject(user.id);

      const res = await request(app).get('/api/projects');

      expect(res.body).toHaveLength(2);
    });

    it('filters by school', async () => {
      const { user } = await createTestUser({ school: 'KNUST' });
      await createTestProject(user.id, { title: 'KNUST project' });

      const res = await request(app).get('/api/projects?school=UG');

      expect(res.body).toHaveLength(0);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('returns a single project with comments and counts', async () => {
      const { user } = await createTestUser();
      const project = await createTestProject(user.id);

      const res = await request(app).get(`/api/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(project.id);
      expect(res.body._count).toEqual({ upvotes: 0, comments: 0 });
    });

    it('returns 404 for a nonexistent project', async () => {
      const res = await request(app).get('/api/projects/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/projects/:id/upvote', () => {
    it('rejects an unauthenticated request with 401', async () => {
      const { user } = await createTestUser();
      const project = await createTestProject(user.id);

      const res = await request(app).post(`/api/projects/${project.id}/upvote`);
      expect(res.status).toBe(401);
    });

    it('rejects a request with an invalid token with 401', async () => {
      const { user } = await createTestUser();
      const project = await createTestProject(user.id);

      const res = await request(app)
        .post(`/api/projects/${project.id}/upvote`)
        .set('Authorization', 'Bearer not-a-real-token');

      expect(res.status).toBe(401);
    });

    it('toggles an upvote on and off for an authenticated user', async () => {
      const { user: author } = await createTestUser();
      const { user: voter } = await createTestUser();
      const project = await createTestProject(author.id);
      const token = tokenFor(voter.id);

      const first = await request(app)
        .post(`/api/projects/${project.id}/upvote`)
        .set('Authorization', `Bearer ${token}`);
      expect(first.status).toBe(201);
      expect(first.body.upvoted).toBe(true);

      const second = await request(app)
        .post(`/api/projects/${project.id}/upvote`)
        .set('Authorization', `Bearer ${token}`);
      expect(second.status).toBe(200);
      expect(second.body.upvoted).toBe(false);
    });
  });
});
