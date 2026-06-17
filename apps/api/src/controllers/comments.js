import { prisma } from '../prisma/client.js';

/**
 * @route   POST /api/projects/:id/comments
 * @desc    Submit feedback on a student project using the 'content' schema mapping
 */
export const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { id: projectId } = req.params;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const comment = await prisma.comment.create({
      data: { 
        content, 
        userId: req.user.id, 
        projectId 
      },
      include: { 
        user: { select: { username: true, name: true } } 
      }
    });

    res.status(201).json(comment);
  } catch (error) { 
    next(error); 
  }
};