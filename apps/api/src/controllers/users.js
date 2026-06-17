import { prisma } from '../prisma/client.js';

/**
 * @route   GET /api/users/profile/:username
 * @desc    Fetch a student's profile and all their shipped builds
 * @access  Public
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        school: true,
        avatarUrl: true,
        // Pull down all projects this specific user authored
        projects: {
          include: {
            _count: { select: { upvotes: true, comments: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Developer profile not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};