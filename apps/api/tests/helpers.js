import bcrypt from 'bcryptjs';
import { prisma } from '../src/prisma/client.js';

export async function resetDb() {
  await prisma.upvote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(overrides = {}) {
  const password = overrides.rawPassword || 'TestPass123';
  const user = await prisma.user.create({
    data: {
      name: overrides.name || 'Test User',
      username: overrides.username || `testuser_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email: overrides.email || `test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@example.com`,
      password: await bcrypt.hash(password, 4),
      school: overrides.school || 'UG',
    },
  });
  return { user, rawPassword: password };
}

export async function createTestProject(authorId, overrides = {}) {
  return prisma.project.create({
    data: {
      title: overrides.title || 'Test Project',
      description: overrides.description || 'A project created for automated tests.',
      imageUrl: overrides.imageUrl || 'https://example.com/screenshot.png',
      githubUrl: overrides.githubUrl || 'https://github.com/example/repo',
      liveUrl: overrides.liveUrl ?? null,
      tags: overrides.tags || ['React'],
      feedbackRequest: overrides.feedbackRequest ?? null,
      authorId,
    },
  });
}
