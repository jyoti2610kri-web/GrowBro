import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decodedData.id } });

    if (!user) {
      return res.status(401).json({ message: "Token is invalid or user no longer exists" });
    }

    req.userId = decodedData.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
