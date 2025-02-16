import jwt from 'jsonwebtoken';
import "dotenv/config";
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });
};

 const verifyToken = (token) => {


    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
   return decoded
    
    } catch (error) {
      return res.status(401).json({ message: "Invalid Token" });
    }
  };
export { generateToken, verifyToken };