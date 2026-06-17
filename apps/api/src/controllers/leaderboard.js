import { prisma } from '../prisma/client.js';

/**
 * @route   GET /api/leaderboard
 * @desc    Fetch top builds ranked dynamically by upvote volume
 * @access  Public
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const topProjects = await prisma.project.findMany({
      include: {
        author: {
          select: { username: true, school: true }
        },
        _count: {
          select: { upvotes: true, comments: true }
        }
      }
    });

    // Sort in memory by highest upvote counts for precise positioning
    const ranked = topProjects.sort((a, b) => b._count.upvotes - a._count.upvotes);

    res.status(200).json(ranked);
  } catch (error) {
    next(error);
  }
};