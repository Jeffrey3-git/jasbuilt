import { prisma } from '../prisma/client.js';

/**
 * @route   POST /api/projects
 * @desc    Submit a new student project showcase
 * @access  Private (Requires valid JWT)
 */
export const createProject = async (req, res, next) => {
  try {
    // 1. Structural Check: Ensure a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'A project screenshot image upload is required.' });
    }

    // ✅ FIXED: Changed 'tags' to 'techStack' to match what frontend FormData appends
    const { title, description, githubUrl, liveUrl, techStack } = req.body;

    if (!title || !description || !githubUrl || !techStack) {
      return res.status(400).json({ message: 'Missing core descriptive text fields.' });
    }

    // ✅ FIXED: Parse 'techStack' string array back into clean JavaScript array
    const parsedTags = typeof techStack === 'string' ? JSON.parse(techStack) : techStack;

    // 2. Database Insertion with Live Cloudinary CDN URL
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl: req.file.path, // The highly optimized secure CDN link from Cloudinary
        githubUrl,
        liveUrl,
        tags: parsedTags, // Maps perfectly to Prisma schema's 'tags' property string array
        authorId: req.user.id
      },
      include: {
        author: {
          select: { username: true, name: true, school: true, avatarUrl: true }
        }
      }
    });

    res.status(201).json({
      message: 'Project successfully shipped to JASBuilt!',
      project: newProject
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects
 * @desc    Fetch all projects sorted by newest entries with aggregate upvote counts
 * @access  Public
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const { tag, school } = req.query;

    // Dynamic Filter Build Engine (Tech Industry Pattern)
    const whereClause = {};
    
    if (tag) {
      whereClause.tags = { has: tag };
    }
    if (school) {
      whereClause.author = { school: school.toUpperCase() };
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        author: {
          select: { username: true, name: true, school: true, avatarUrl: true }
        },
        _count: {
          select: { upvotes: true, comments: true } // Keeps queries lightning fast via relational aggregates
        }
      },
      orderBy: {
        createdAt: 'desc' // Ensures newest community submissions bubble up first
      }
    });

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Fetch a single project detail profile along with its comments
 * @access  Public
 */
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        // Fetch the profile of the student who built it
        author: { 
          select: { username: true, name: true, school: true, avatarUrl: true } 
        },
        // Pull down all related feedback comments chronologically
        comments: {
          include: { 
            user: { select: { username: true, name: true } } 
          },
          orderBy: { createdAt: 'desc' }
        },
        // Aggregate statistics for the UI pills
        _count: { 
          select: { upvotes: true, comments: true } 
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project build profile not found.' });
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/projects/:id/upvote
 * @desc    Atomic upvote tracker using your compound unique index architecture
 * @access  Private (Requires protect middleware)
 */
export const toggleUpvote = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const userId = req.user.id;

    // Verify project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    // Check for existing upvote relation
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });

    if (existingUpvote) {
      // Undo action if clicked again
      await prisma.upvote.delete({
        where: {
          userId_projectId: { userId, projectId }
        }
      });
      return res.status(200).json({ upvoted: false });
    }

    // Insert new interaction
    await prisma.upvote.create({
      data: { userId, projectId }
    });

    res.status(201).json({ upvoted: true });
  } catch (error) {
    next(error);
  }
};
