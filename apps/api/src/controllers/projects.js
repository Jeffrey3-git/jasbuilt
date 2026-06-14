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

    // Notice we removed imageUrl from req.body, because it's coming from req.file now!
    const { title, description, githubUrl, liveUrl, tags } = req.body;

    if (!title || !description || !githubUrl || !tags) {
      return res.status(400).json({ message: 'Missing core descriptive text fields.' });
    }

    // Convert stringified tags array from frontend forms back into a real JavaScript array
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    // 2. Database Insertion with Live Cloudinary CDN URL
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl: req.file.path, // The highly optimized secure CDN link from Cloudinary
        githubUrl,
        liveUrl,
        tags: parsedTags,
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
