import { verifyToken } from "../utils/jwt.js";


export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  try {
    const decoded = verifyToken(token);
console.log(decoded);

    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
    console.log(req.user);
    
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};