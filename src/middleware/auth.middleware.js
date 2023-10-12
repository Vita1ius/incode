import { authenticateToken } from '../service/jwt.js';
import jwt from 'jsonwebtoken';

export async function authenticated(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = await authenticateToken(token);
    req.user = decoded.user;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}