import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client.js";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, username, email, password, school } = req.body;

    if (!name || !username || !email || !password || !school) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res.status(409).json({ error: "Email or username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, username, email, password: passwordHash, school },
    });

    const token = signToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        school: user.school,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        school: user.school,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};