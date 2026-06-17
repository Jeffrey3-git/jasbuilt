import { prisma } from '../prisma/client.js';

/**
 * @route   POST /api/projects/:id/upvote
 * @desc    Toggle upvote state on a student project showcase
 * @access  Private (Requires valid JWT via protect middleware)
 */
export const toggleUpvote = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const userId = req.user.id; // Pulled straight from our protective middleware shield

    // 1. Verify target project exists in the ecosystem database
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: 'Target build project record not found.' });
    }

    // 2. Check if this specific user has already cast an upvote
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_projectId: { userId, projectId } // Leverages our compound unique index
      }
    });

    if (existingUpvote) {
      // De-escalation: User clicked it again, so we REMOVE the upvote (Undo action)
      await prisma.upvote.delete({
        where: {
          userId_projectId: { userId, projectId }
        }
      });

      return res.status(200).json({ 
        message: 'Upvote successfully withdrawn.', 
        hasUpvoted: false 
      });
    }

    // Escalation: Fresh interaction, create the record entry
    await prisma.upvote.create({
      data: { userId, projectId }
    });

    res.status(200).json({ 
      message: 'Upvote successfully recorded!', 
      hasUpvoted: true 
    });
  } catch (error) {
    next(error);
  }
};