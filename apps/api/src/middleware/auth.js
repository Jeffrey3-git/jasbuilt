import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorised — no token" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, username: true, email: true, school: true },
    });

    if (!req.user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
