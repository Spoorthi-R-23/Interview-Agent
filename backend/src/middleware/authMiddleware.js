import { verifyToken } from '../utils/jwt.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = verifyToken(authHeader.split(' ')[1]);
    // Create a mock user from token data
    req.user = {
      _id: decoded.sub,
      id: decoded.sub,
      email: decoded.email,
      name: decoded.email.split('@')[0],
      role: 'candidate'
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
