import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/prisma/client.js';
import { resetDb, createTestUser } from './helpers.js';

describe('auth', () => {
  beforeEach(resetDb);
  afterAll(async () => {
    await resetDb();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('creates a user and returns a token', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Jane Dev',
        username: 'janedev',
        email: 'jane@example.com',
        password: 'SecurePass123',
        school: 'UG',
      });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeTruthy();
      expect(res.body.user.username).toBe('janedev');
      expect(res.body.user.password).toBeUndefined();
    });

    it('hashes the password rather than storing it in plain text', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Jane Dev',
        username: 'janedev',
        email: 'jane@example.com',
        password: 'SecurePass123',
        school: 'UG',
      });

      const stored = await prisma.user.findUnique({ where: { username: 'janedev' } });
      expect(stored.password).not.toBe('SecurePass123');
      expect(stored.password.startsWith('$2')).toBe(true); // bcrypt hash prefix
    });

    it('rejects a duplicate email or username with 409', async () => {
      await createTestUser({ username: 'taken', email: 'taken@example.com' });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Someone Else',
        username: 'taken',
        email: 'different@example.com',
        password: 'SecurePass123',
        school: 'UG',
      });

      expect(res.status).toBe(409);
    });

    it('rejects a registration missing required fields with 400', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'incomplete@example.com' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with correct username + password', async () => {
      const { user, rawPassword } = await createTestUser({ username: 'loginuser' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ emailOrUsername: user.username, password: rawPassword });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
      expect(res.body.user.id).toBe(user.id);
    });

    it('logs in with correct email + password', async () => {
      const { user, rawPassword } = await createTestUser({ email: 'byemail@example.com' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ emailOrUsername: user.email, password: rawPassword });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
    });

    it('rejects a wrong password with 401', async () => {
      const { user } = await createTestUser();

      const res = await request(app)
        .post('/api/auth/login')
        .send({ emailOrUsername: user.username, password: 'wrong-password' });

      expect(res.status).toBe(401);
    });

    it('rejects a nonexistent user with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ emailOrUsername: 'nobody_here', password: 'whatever123' });

      expect(res.status).toBe(401);
    });
  });
});
